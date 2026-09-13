/**
 * Fit scoring with a small Workers AI model, JSON-schema constrained, with a fallback chain.
 *
 * The deterministic filters in Djinni.ts already removed off-lane posts; the model's job is the
 * judgment call: how well the post matches Dan's stack, how winnable it is, how stackable the
 * role looks (meetings, team size), and a two-line summary in the language of the post.
 */
import { Effect, Option, Redacted } from "effect";
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http";

export interface ScoreInput {
  readonly title: string;
  readonly company: string | null;
  readonly source: string;
  readonly description: string;
  readonly detail: Record<string, unknown> | null;
  readonly flags: string[];
}

export interface ScoreResult {
  readonly skills_fit: number;
  readonly winnability: number;
  readonly stackability: number;
  readonly signal: number;
  readonly total: number;
  readonly verdict: "apply" | "apply-low" | "skip";
  readonly language: "en" | "uk";
  readonly summary: string;
  readonly model: string;
}

export class ScoreError extends Error {
  readonly _tag = "ScoreError";
  constructor(readonly model: string, readonly cause: unknown) {
    super(`scoring failed on ${model}`);
  }
}

export interface AiRunner {
  readonly run: (model: string, inputs: Record<string, unknown>) => Effect.Effect<unknown, unknown, any>;
}

export const PRIMARY_MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8-fast";
export const SECONDARY_MODEL = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
export const OPENROUTER_MODEL = "openrouter/free";

const schema = {
  type: "object",
  properties: {
    skills_fit: { type: "integer", minimum: 1, maximum: 5 },
    winnability: { type: "integer", minimum: 1, maximum: 5 },
    stackability: { type: "integer", minimum: 1, maximum: 5 },
    signal: { type: "integer", minimum: 1, maximum: 5 },
    language: { type: "string", enum: ["en", "uk"] },
    summary: { type: "string" },
  },
  required: ["skills_fit", "winnability", "stackability", "signal", "language", "summary"],
} as const;

export const SYSTEM_PROMPT = `You score job posts for Daniil, a full-stack TypeScript developer in Vienna (3 years commercial: React, Next.js, TanStack, Astro, Node/Bun, Express, Postgres, Drizzle, Redis, Effect.ts, Cloudflare/Vercel, Docker, CI). He stacks remote jobs and wants few meetings. Rate 1-5:
- skills_fit: how much of the required stack he already ships (TypeScript/React/Node/Postgres = 5; Angular, .NET, Python-first, mobile = 1).
- winnability: fresh post, moderate applicant count, years required <= 3, remote, clear scope = 5; 5+ years, on-site, hundreds of applicants = 1.
- stackability: small team, async, product company, ownership, part-time possible = 5; outstaff scrum team with daily calls and strict 9-6 overlap = 1.
- signal: real company with a specific post = 5; recycled template, vague, salary hidden = 2.
language: "uk" if the post is mostly Ukrainian, else "en".
summary: two short lines, in that language, saying what the job is and the one thing that makes it a fit or not. Return JSON only.`;

const userPrompt = (input: ScoreInput) =>
  [
    `Source: ${input.source}`,
    `Title: ${input.title}`,
    `Company: ${input.company ?? "unknown"}`,
    `Flags: ${input.flags.join(", ") || "none"}`,
    `Detail: ${JSON.stringify(input.detail ?? {})}`,
    "Post:",
    input.description.slice(0, 3500),
  ].join("\n");

const clamp = (n: unknown): number => Math.min(5, Math.max(1, Math.round(Number(n) || 1)));

const parseResult = (raw: unknown, model: string): ScoreResult => {
  let obj: any = raw;
  if (obj && typeof obj === "object" && "response" in obj) obj = (obj as any).response;
  if (typeof obj === "string") {
    const m = obj.match(/\{[\s\S]*\}/);
    obj = JSON.parse(m ? m[0] : obj);
  }
  const skills_fit = clamp(obj.skills_fit);
  const winnability = clamp(obj.winnability);
  const stackability = clamp(obj.stackability);
  const signal = clamp(obj.signal);
  const total = skills_fit + winnability + stackability + signal;
  const noOnes = Math.min(skills_fit, winnability, stackability, signal) > 1;
  const verdict: ScoreResult["verdict"] = total >= 15 && noOnes ? "apply" : total >= 12 && skills_fit >= 3 ? "apply-low" : "skip";
  return {
    skills_fit,
    winnability,
    stackability,
    signal,
    total,
    verdict,
    language: obj.language === "uk" ? "uk" : "en",
    summary: String(obj.summary ?? "").slice(0, 400),
    model,
  };
};

const viaWorkersAi = (ai: AiRunner, model: string, input: ScoreInput) =>
  ai
    .run(model, {
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt(input) },
      ],
      response_format: { type: "json_schema", json_schema: schema },
      max_tokens: 400,
    })
    .pipe(
      Effect.flatMap((raw) => Effect.try({ try: () => parseResult(raw, model), catch: (e) => e })),
      Effect.mapError((cause) => new ScoreError(model, cause)),
    );

const viaOpenRouter = (client: HttpClient.HttpClient, key: Redacted.Redacted<string>, input: ScoreInput) =>
  HttpClientRequest.post("https://openrouter.ai/api/v1/chat/completions").pipe(
    HttpClientRequest.setHeaders({ authorization: `Bearer ${Redacted.value(key)}` }),
    HttpClientRequest.bodyJsonUnsafe({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt(input) },
      ],
      response_format: { type: "json_object" },
      max_tokens: 400,
    }),
    client.execute,
    Effect.flatMap(HttpClientResponse.filterStatusOk),
    Effect.flatMap((res) => res.json),
    Effect.timeout("25 seconds"),
    Effect.flatMap((json: any) =>
      Effect.try({
        try: () => parseResult(json?.choices?.[0]?.message?.content, OPENROUTER_MODEL),
        catch: (e) => e,
      }),
    ),
    Effect.mapError((cause) => new ScoreError(OPENROUTER_MODEL, cause)),
  );

/** Primary → secondary → OpenRouter (if a key exists). Fails with the last error. */
export const score = (
  ai: AiRunner,
  client: HttpClient.HttpClient,
  openRouterKey: Option.Option<Redacted.Redacted<string>>,
  input: ScoreInput,
): Effect.Effect<ScoreResult, ScoreError, any> =>
  viaWorkersAi(ai, PRIMARY_MODEL, input).pipe(
    Effect.catch(() => viaWorkersAi(ai, SECONDARY_MODEL, input)),
    Effect.catch((err) =>
      Option.isSome(openRouterKey) ? viaOpenRouter(client, openRouterKey.value, input) : Effect.fail(err),
    ),
  );
