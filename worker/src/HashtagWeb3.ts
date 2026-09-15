/**
 * hashtagweb3.com aggregates the ATS boards (Greenhouse, Ashby, Lever) of web3 companies and
 * exposes them as JSON: title, company, link, date, location, department, but no description.
 * Only engineering departments are kept; the job page is not fetched in this phase, so the
 * description a row gets is what the listing says.
 */
import { Effect, Schedule } from "effect";
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http";

import { UA } from "./Djinni.ts";
import { DjinniFetchError } from "./Errors.ts";

export const HASHTAGWEB3_URL = "https://hashtagweb3.com/api/v1/jobs?limit=50&offset=0";
export const HASHTAGWEB3_SITE = "https://hashtagweb3.com";

export interface HashtagJob {
  readonly id: string;
  readonly title: string;
  readonly company: string | null;
  readonly url: string;
  readonly location: string | null;
  readonly department: string | null;
  readonly postedAt: string | null;
  readonly ageHours: number;
}

const ENGINEERING = /engineer|develop|software|tech/i;

const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

/** Active listings whose department (when the ATS reports one) is an engineering one. */
export const parseHashtagWeb3 = (json: any, now = Date.now()): HashtagJob[] => {
  const rows: any[] = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];
  const out: HashtagJob[] = [];
  for (const r of rows) {
    const title = str(r?.title);
    const url = str(r?.link);
    const id = str(r?.id) ?? str(r?.slug);
    if (!title || !url || !id || r?.active === false) continue;
    const department = str(r?.department);
    if (department && !ENGINEERING.test(department)) continue;
    const posted = str(r?.date) ? new Date(String(r.date)) : new Date(Number.NaN);
    const valid = !Number.isNaN(posted.getTime());
    out.push({
      id,
      title,
      company: str(r?.company),
      url,
      location: str(r?.location),
      department,
      postedAt: valid ? posted.toISOString() : null,
      ageHours: valid ? (now - posted.getTime()) / 36e5 : Number.NaN,
    });
  }
  return out;
};

export const fetchHashtagWeb3 = (client: HttpClient.HttpClient) =>
  HttpClientRequest.get(HASHTAGWEB3_URL).pipe(
    HttpClientRequest.setHeaders({ "user-agent": UA, accept: "application/json" }),
    client.execute,
    Effect.flatMap(HttpClientResponse.filterStatusOk),
    Effect.flatMap((res) => res.json),
    Effect.timeout("15 seconds"),
    Effect.retry({ schedule: Schedule.exponential("500 millis"), times: 1 }),
    Effect.mapError((cause) => DjinniFetchError.make({ url: HASHTAGWEB3_URL, cause })),
    Effect.map((json) => parseHashtagWeb3(json)),
  );
