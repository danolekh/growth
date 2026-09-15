/**
 * web3.career's job API (free token, attribution required). The documented response is an array
 * whose last element is the array of jobs, but the envelope has changed before, so the parser
 * looks for the first array of objects carrying a `title` anywhere in the payload.
 */
import { Effect, Redacted, Schedule } from "effect";
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http";

import { toText, UA } from "./Djinni.ts";
import { DjinniFetchError } from "./Errors.ts";

export const WEB3_CAREER_SITE = "https://web3.career";

export const web3CareerUrl = (token: string) =>
  `https://web3.career/api/v1?token=${encodeURIComponent(token)}&remote=true&limit=100`;

export interface Web3CareerJob {
  readonly id: string;
  readonly title: string;
  readonly company: string | null;
  readonly location: string | null;
  readonly url: string;
  readonly description: string;
  readonly tags: string[];
  readonly postedAt: string | null;
  readonly ageHours: number;
}

const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

const isJobRow = (v: unknown): boolean => typeof v === "object" && v !== null && !Array.isArray(v) && typeof (v as any).title === "string";

/** Depth-first: the first array whose elements look like job rows. */
export const findJobs = (payload: unknown, depth = 0): any[] => {
  if (depth > 6 || payload === null || typeof payload !== "object") return [];
  if (Array.isArray(payload)) {
    if (payload.length > 0 && payload.every(isJobRow)) return payload;
    for (const el of payload) {
      const found = findJobs(el, depth + 1);
      if (found.length) return found;
    }
    return [];
  }
  for (const v of Object.values(payload as Record<string, unknown>)) {
    const found = findJobs(v, depth + 1);
    if (found.length) return found;
  }
  return [];
};

export const parseWeb3Career = (payload: unknown, now = Date.now()): Web3CareerJob[] => {
  const out: Web3CareerJob[] = [];
  for (const r of findJobs(payload)) {
    const title = str(r.title);
    const id = r.id != null ? String(r.id) : null;
    const url = str(r.apply_url) ?? str(r.url) ?? (id ? `${WEB3_CAREER_SITE}/${id}` : null);
    if (!title || !id || !url) continue;
    const posted = str(r.date) ? new Date(String(r.date)) : new Date(Number.NaN);
    const valid = !Number.isNaN(posted.getTime());
    const location = [str(r.location), str(r.country)].filter(Boolean).join(", ") || null;
    const tags: string[] = Array.isArray(r.tags) ? r.tags.map(String) : typeof r.tags === "string" ? r.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [];
    out.push({
      id,
      title,
      company: str(r.company),
      location,
      url,
      description: toText(String(r.description ?? "")).slice(0, 6000),
      tags,
      postedAt: valid ? posted.toISOString() : null,
      ageHours: valid ? (now - posted.getTime()) / 36e5 : Number.NaN,
    });
  }
  return out;
};

export const fetchWeb3Career = (client: HttpClient.HttpClient, token: Redacted.Redacted<string>) => {
  const url = web3CareerUrl(Redacted.value(token));
  return HttpClientRequest.get(url).pipe(
    HttpClientRequest.setHeaders({ "user-agent": UA, accept: "application/json" }),
    client.execute,
    Effect.flatMap(HttpClientResponse.filterStatusOk),
    Effect.flatMap((res) => res.json),
    Effect.timeout("20 seconds"),
    Effect.retry({ schedule: Schedule.exponential("500 millis"), times: 1 }),
    // The token is in the query string; the logged URL must not carry it.
    Effect.mapError((cause) => DjinniFetchError.make({ url: `${WEB3_CAREER_SITE}/api/v1`, cause })),
    Effect.map((json) => parseWeb3Career(json)),
  );
};
