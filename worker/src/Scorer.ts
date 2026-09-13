/**
 * Fit scoring with a small Workers AI model, JSON-schema constrained, with a fallback chain.
 *
 * The deterministic filters in Djinni.ts already removed off-lane posts; the model makes the
 * judgment call: stack match, winnability, how stackable the role looks (meetings, team size),
 * and a two-line summary in the language of the post. The language itself is decided by script.
 */
import type { RuntimeContext } from "alchemy/RuntimeContext";
import { Context, Effect, Layer, Option, Redacted } from "effect";
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http";

import { WorkersAi } from "./Bindings.ts";
import { ScoreError } from "./Errors.ts";
import { Settings } from "./Settings.ts";

export interface ScoreInput {
  readonly title: string;
  readonly company: string | null;
  readonly source: string;
  readonly description: string;
  readonly detail: Record<string, unknown> | null;
  readonly flags: ReadonlyArray<string>;
  /** Decided by script, not by the model: uk when the post is mostly Cyrillic. */
  readonly language: "en" | "uk";
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

/** Share of Cyrillic among letters; above 0.2 the post is treated as Ukrainian. */
export const detectLanguage = (text: string): "en" | "uk" => {
  const letters = text.match(/\p{L}/gu)?.length ?? 0;
  const cyr = text.match(/[Ѐ-ӿ]/g)?.length ?? 0;
  return letters > 0 && cyr / letters > 0.2 ? "uk" : "en";
};

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
language: copy the "Language" line from the input.
summary: two short lines, written in that language (uk = Ukrainian, en = English), saying what the job is and the one thing that makes it a fit or not. Return JSON only.`;

const userPrompt = (input: ScoreInput) =>
  [
    `Source: ${input.source}`,
    `Title: ${input.title}`,
    `Company: ${input.company ?? "unknown"}`,
    `Flags: ${input.flags.join(", ") || "none"}`,
    `Language: ${input.language}`,
    `Detail: ${JSON.stringify(input.detail ?? {})}`,
    "Post:",
    input.description.slice(0, 3500),
  ].join("\n");

const clamp = (n: unknown): number => Math.min(5, Math.max(1, Math.round(Number(n) || 1)));

const parseResult = (raw: unknown, model: string, language: "en" | "uk"): ScoreResult => {
  let obj: any = raw;
  if (obj && typeof obj === "object" && "response" in obj) obj = obj.response;
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
  const verdict: ScoreResult["verdict"] =
    total >= 15 && noOnes ? "apply" : total >= 12 && skills_fit >= 3 ? "apply-low" : "skip";
  return { skills_fit, winnability, stackability, signal, total, verdict, language, summary: String(obj.summary ?? "").slice(0, 400), model };
};

export class Scorer extends Context.Service<
  Scorer,
  {
    readonly score: (input: ScoreInput) => Effect.Effect<ScoreResult, ScoreError, RuntimeContext>;
  }
>()("growth/Scorer") {
  static readonly layer = Layer.effect(Scorer)(
    Effect.gen(function* () {
      const ai = yield* WorkersAi;
      const client = yield* HttpClient.HttpClient;
      const settings = yield* Settings;

      const viaWorkersAi = Effect.fn("Scorer.workersAi")(function* (model: string, input: ScoreInput) {
        const raw = yield* ai
          .run(model as any, {
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userPrompt(input) },
            ],
            response_format: { type: "json_schema", json_schema: schema },
            max_tokens: 400,
          } as any)
          .pipe(Effect.mapError((cause) => ScoreError.make({ model, cause })));
        return yield* Effect.try({ try: () => parseResult(raw, model, input.language), catch: (cause) => ScoreError.make({ model, cause }) });
      });

      const viaOpenRouter = Effect.fn("Scorer.openRouter")(function* (key: Redacted.Redacted<string>, input: ScoreInput) {
        const json: any = yield* HttpClientRequest.post("https://openrouter.ai/api/v1/chat/completions").pipe(
          HttpClientRequest.bearerToken(Redacted.value(key)),
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
          Effect.mapError((cause) => ScoreError.make({ model: OPENROUTER_MODEL, cause })),
        );
        return yield* Effect.try({
          try: () => parseResult(json?.choices?.[0]?.message?.content, OPENROUTER_MODEL, input.language),
          catch: (cause) => ScoreError.make({ model: OPENROUTER_MODEL, cause }),
        });
      });

      return {
        score: (input) =>
          viaWorkersAi(PRIMARY_MODEL, input).pipe(
            Effect.catch(() => viaWorkersAi(SECONDARY_MODEL, input)),
            Effect.catch((err) =>
              Option.isSome(settings.openRouterKey) ? viaOpenRouter(settings.openRouterKey.value, input) : Effect.fail(err),
            ),
          ),
      };
    }),
  );
}
