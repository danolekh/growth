/**
 * Hacker News "Ask HN: Who is hiring?" as a source, through Algolia's public API (no key).
 *
 * The monthly thread has a few hundred top-level comments in a loose "Company | Role | Location |
 * REMOTE | …" format. Pages of 100 arrive newest first, so page 0 re-read daily catches late
 * additions while the other pages are walked once. Everything is pure except the two fetches.
 */
import { Effect, Schedule } from "effect";
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http";

import { decode, toText } from "./Djinni.ts";
import { DjinniFetchError } from "./Errors.ts";
import { WEB3_STACK } from "./Web3Lane.ts";

export interface HnThread {
  readonly id: string;
  readonly title: string;
  readonly createdAt: string;
  readonly comments: number;
}

export interface HnPage {
  readonly page: number;
  readonly pages: number;
  readonly total: number;
  readonly posts: HnPost[];
}

export interface HnPost {
  readonly id: string;
  readonly url: string;
  readonly company: string | null;
  readonly title: string;
  readonly text: string;
  readonly createdAt: string;
  readonly flags: string[];
}

const ALGOLIA = "https://hn.algolia.com/api/v1";

/** Finds the newest "Who is hiring?" thread by the official poster. */
export const parseThread = (json: any): HnThread | null => {
  const hit = (json?.hits ?? []).find((h: any) => /who is hiring/i.test(String(h.title ?? "")));
  return hit ? { id: String(hit.objectID), title: String(hit.title), createdAt: String(hit.created_at), comments: Number(hit.num_comments ?? 0) } : null;
};

const STACK = /\b(typescript|react|next\.?js|node(\.js)?|tanstack|effect[- ]?ts|astro|remix|bun|drizzle|postgres|solidity|viem|wagmi|ethers|evm|web3|foundry)\b/i;
const REMOTE = /\bremote\b/i;
// No outer \b: several alternatives start or end with punctuation, which has no word boundary.
const US_ONLY = /(\bus[- ]only\b|\bus[- ]based\b|\bunited states\b|\(\s*usa?\s*(?:only|time ?zones?|based)?\s*\)|\bus time ?zones?\b|\bus citizens?\b|\bnorth america\b|remote,?\s*usa?\b|\busa\b|\bus\/canada\b|\bcanada\/us\b)/i;
const OPEN = /(\bworldwide\b|\banywhere\b|\bglobal(ly)?\b|\beurope(an)?\b|\beu\b|\bemea\b|\bcet\b|\bcest\b|utc\s*[+-]|\binternational\b|\bukraine\b|\baustria\b|\bgermany\b|\buk\b)/i;
const ONSITE_ONLY = /\bonsite\b(?![^|]*remote)/i;

/** Top-level comments of the thread on one page, filtered to the stack and to remote roles. */
export const parsePage = (json: any, threadId: string): HnPage => {
  const posts: HnPost[] = [];
  for (const h of json?.hits ?? []) {
    if (String(h.parent_id) !== String(threadId) || !h.comment_text) continue;
    const text = toText(decode(String(h.comment_text)));
    if (!STACK.test(text) || !REMOTE.test(text)) continue;
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const firstLine = lines[0] ?? "";
    // Some posts use a "Location: … / Remote: … / Technologies: …" form; the headline is then the body.
    const keyValueForm = /^(location|remote|willing to relocate|technologies|technology|visa)\s*:/i.test(firstLine);
    const title = (keyValueForm ? lines.slice(0, 4).join(" · ") : firstLine.length > 8 ? firstLine : text.slice(0, 100)).slice(0, 120);
    const segments = firstLine.split("|").map((s) => s.trim()).filter(Boolean);
    const company = !keyValueForm && segments.length > 1 && segments[0]!.length <= 60 ? segments[0]!.replace(/\s*\(.*?\)\s*$/, "") : null;
    const flags = ["hn"];
    const usOnly = US_ONLY.test(text) && !OPEN.test(text);
    if (usOnly) flags.push("us-only");
    if (OPEN.test(text)) flags.push("open-region");
    if (/\bcontract\b/i.test(text)) flags.push("contract");
    if (/part[- ]?time/i.test(text)) flags.push("part-time");
    if (STACK.test(text) && /\b(tanstack|effect[- ]?ts|astro|drizzle)\b/i.test(text)) flags.push("niche-stack");
    if (ONSITE_ONLY.test(firstLine) && !REMOTE.test(firstLine)) flags.push("onsite");
    if (WEB3_STACK.test(text)) flags.push("web3");
    posts.push({
      id: String(h.objectID),
      url: `https://news.ycombinator.com/item?id=${h.objectID}`,
      company,
      title,
      text: text.slice(0, 6000),
      createdAt: String(h.created_at),
      flags,
    });
  }
  return { page: Number(json?.page ?? 0), pages: Number(json?.nbPages ?? 1), total: Number(json?.nbHits ?? 0), posts };
};

const getJson = (client: HttpClient.HttpClient, url: string) =>
  HttpClientRequest.get(url).pipe(
    HttpClientRequest.setHeaders({ accept: "application/json" }),
    client.execute,
    Effect.flatMap(HttpClientResponse.filterStatusOk),
    Effect.flatMap((res) => res.json),
    Effect.timeout("15 seconds"),
    Effect.retry({ schedule: Schedule.exponential("500 millis"), times: 1 }),
    Effect.mapError((cause) => DjinniFetchError.make({ url, cause })),
  );

export const fetchLatestThread = (client: HttpClient.HttpClient) =>
  getJson(client, `${ALGOLIA}/search_by_date?query=%22who%20is%20hiring%22&tags=story,author_whoishiring&hitsPerPage=3`).pipe(
    Effect.map(parseThread),
  );

export const fetchPage = (client: HttpClient.HttpClient, threadId: string, page: number) =>
  getJson(client, `${ALGOLIA}/search_by_date?tags=comment,story_${threadId}&hitsPerPage=100&page=${page}`).pipe(
    Effect.map((json) => parsePage(json, threadId)),
  );
