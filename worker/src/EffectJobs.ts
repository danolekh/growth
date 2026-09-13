/**
 * The Effect community job directory at effect.website/effect-jobs: a static page of cards, each
 * an anchor whose text reads "Company: X Role: Y <blurb> [Pay range …] Location … Apply at …".
 * Every role here has Effect in the stack, which is Dan's rarest asset, so these land hot.
 */
import { Effect, Schedule } from "effect";
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http";

import { decode, UA } from "./Djinni.ts";
import { DjinniFetchError } from "./Errors.ts";

export const EFFECT_JOBS_URL = "https://effect.website/effect-jobs/";

export interface EffectJob {
  readonly id: string;
  readonly company: string;
  readonly role: string;
  readonly blurb: string;
  readonly pay: string | null;
  readonly location: string;
  readonly applyUrl: string;
  readonly remote: boolean;
  readonly flags: string[];
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

const US_ONLY = /\b(us[- ]only|us[- ]based|united states|can\/us|\busa?\b)\b/i;
const OPEN = /\b(remote|worldwide|anywhere|europe|eu\b|emea|global)\b/i;

export const parseEffectJobs = (html: string): EffectJob[] => {
  const out: EffectJob[] = [];
  for (const m of html.matchAll(/<a\s+[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const text = decode(m[2]!.replace(/<[^>]+>/g, "\n"))
      .replace(/[ \t]+/g, " ")
      .replace(/\s*\n\s*/g, "\n")
      .trim();
    if (!text.startsWith("Company:")) continue;
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const after = (label: string) => {
      const i = lines.findIndex((l) => l === label || l === `${label}:`);
      return i > -1 ? (lines[i + 1] ?? "") : "";
    };
    const company = after("Company");
    const role = after("Role");
    const pay = after("Pay range") || null;
    const location = after("Location");
    const roleIdx = lines.indexOf(role);
    const blurb = roleIdx > -1 ? (lines[roleIdx + 1] ?? "") : "";
    if (!company || !role) continue;
    const remote = /remote/i.test(location);
    const flags = ["effect", "niche-stack"];
    if (!remote) flags.push("onsite");
    if (remote && US_ONLY.test(location) && !/(worldwide|anywhere|europe|\beu\b|global)/i.test(location)) flags.push("us-only");
    if (OPEN.test(location) && /(worldwide|anywhere|europe|\beu\b|global)/i.test(location)) flags.push("open-region");
    if (/intern/i.test(role)) flags.push("intern");
    out.push({
      id: slug(`${company}-${role}`),
      company,
      role,
      blurb: blurb === "Pay range" || blurb === "Location" ? "" : blurb,
      pay,
      location,
      applyUrl: m[1]!.startsWith("http") ? m[1]! : `https://effect.website${m[1]}`,
      remote,
      flags,
    });
  }
  return out;
};

export const fetchEffectJobs = (client: HttpClient.HttpClient) =>
  HttpClientRequest.get(EFFECT_JOBS_URL).pipe(
    HttpClientRequest.setHeaders({ "user-agent": UA, accept: "text/html" }),
    client.execute,
    Effect.flatMap(HttpClientResponse.filterStatusOk),
    Effect.flatMap((res) => res.text),
    Effect.timeout("15 seconds"),
    Effect.retry({ schedule: Schedule.exponential("500 millis"), times: 1 }),
    Effect.mapError((cause) => DjinniFetchError.make({ url: EFFECT_JOBS_URL, cause })),
    Effect.map(parseEffectJobs),
  );
