/**
 * Three web3 job boards that publish plain RSS 2.0: CryptoJobsList, hireweb3 and remote3. One
 * parser covers them; the boards differ only in which namespaced tag carries the company and the
 * location (dc:creator / media:location, hireweb3Jobs:*, or remote3's "at Company - Type - Region"
 * description line). Pure parsing, one fetch, no page visits.
 */
import { Effect, Schedule } from "effect";
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http";

import { decode, toText, UA } from "./Djinni.ts";
import { DjinniFetchError } from "./Errors.ts";

export type Web3Board = "cryptojobslist" | "hireweb3" | "remote3";

export const WEB3_BOARDS: Record<Web3Board, { readonly url: string; readonly site: string }> = {
  cryptojobslist: { url: "https://api.cryptojobslist.com/jobs.rss", site: "https://cryptojobslist.com" },
  hireweb3: { url: "https://hireweb3.io/job/rss", site: "https://hireweb3.io" },
  remote3: { url: "https://www.remote3.co/api/rss", site: "https://remote3.co" },
};

export interface Web3FeedItem {
  readonly id: string;
  readonly link: string;
  readonly title: string;
  readonly company: string | null;
  readonly location: string | null;
  readonly postedAt: string | null;
  readonly ageHours: number;
  /** Plain text of the description, capped. */
  readonly description: string;
}

/** Like Djinni's field reader, but tolerant of attributes (`<guid isPermaLink="true">`) and namespaces. */
export const field = (block: string, tag: string): string => {
  const m = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`));
  return m ? m[1]! : "";
};

const text = (block: string, tag: string): string => decode(field(block, tag)).trim();

/** The last non-empty path segment of a URL, or the whole string when it is not a URL. */
export const lastSegment = (url: string): string => {
  const path = url.replace(/[?#].*$/, "").replace(/\/+$/, "");
  const seg = path.slice(path.lastIndexOf("/") + 1);
  return seg || url;
};

/** remote3 describes a job as "at Company - Full-Time - Worldwide - $120k - $240k /yr". */
const remote3Line = (line: string | undefined): { company: string; region: string } | null => {
  if (!line || !/^at\s/.test(line)) return null;
  const [company, , region] = line.replace(/^at\s+/, "").split(/\s+-\s+/);
  return company && region ? { company, region } : null;
};

export const parseWeb3Rss = (xml: string, now = Date.now()): Web3FeedItem[] => {
  const items: Web3FeedItem[] = [];
  for (const m of xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/g)) {
    const block = m[1]!;
    const link = text(block, "link") || text(block, "guid");
    const guid = text(block, "guid");
    const title = text(block, "title");
    if (!link || !title) continue;
    const description = toText(decode(field(block, "description"))).slice(0, 6000);
    const pubDate = text(block, "pubDate");
    const posted = pubDate ? new Date(pubDate) : new Date(Number.NaN);
    const valid = !Number.isNaN(posted.getTime());
    const line = remote3Line(description.split("\n")[0]);
    const locationType = text(block, "hireweb3Jobs:locationType");
    const hireLocation = text(block, "hireweb3Jobs:location");
    const company = text(block, "dc:creator") || text(block, "hireweb3Jobs:companyName") || line?.company || null;
    const location =
      text(block, "media:location") ||
      [hireLocation, locationType].filter(Boolean).join(" / ") ||
      line?.region ||
      null;
    items.push({
      id: lastSegment(link) || lastSegment(guid),
      link,
      title,
      company: company?.trim() || null,
      location: location?.trim() || null,
      postedAt: valid ? posted.toISOString() : null,
      ageHours: valid ? (now - posted.getTime()) / 36e5 : Number.NaN,
      description,
    });
  }
  return items;
};

export const fetchWeb3Feed = (client: HttpClient.HttpClient, board: Web3Board) => {
  const url = WEB3_BOARDS[board].url;
  return HttpClientRequest.get(url).pipe(
    HttpClientRequest.setHeaders({ "user-agent": UA, accept: "application/rss+xml, application/xml, text/xml" }),
    client.execute,
    Effect.flatMap(HttpClientResponse.filterStatusOk),
    Effect.flatMap((res) => res.text),
    Effect.timeout("15 seconds"),
    Effect.retry({ schedule: Schedule.exponential("500 millis"), times: 1 }),
    Effect.mapError((cause) => DjinniFetchError.make({ url, cause })),
    Effect.map((xml) => parseWeb3Rss(xml)),
  );
};
