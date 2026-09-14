/**
 * Djinni ingestion: the public RSS feeds, the deterministic filters, and the public job-page
 * parser. Ported from the Mac-side watcher; the parsing is pure so it can be tested against
 * fixtures and kept cheap (the Worker has 10 ms of CPU per invocation).
 */
import { Effect, Schedule } from "effect";
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http";

import config from "../djinni-config.json";
import { DjinniFetchError } from "./Errors.ts";

export interface DjinniConfig {
  keywords: string[];
  maxAgeHours: number;
  titleExclude: string[];
  mustMatchAny: string[];
  years: { stretchFrom: number; skipAbove: number };
  hot: { maxAgeHours: number; maxApplications: number; maxYears: number };
}

export const djinniConfig = config as DjinniConfig;

export const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

export interface RssItem {
  readonly id: string;
  readonly link: string;
  readonly title: string;
  readonly pubDate: string;
  readonly postedAt: string | null;
  readonly ageHours: number;
  readonly category: string;
  /** The raw (still XML-escaped) description; decoded lazily for new items only. */
  readonly rawDescription: string;
}

export interface JobDetail {
  company?: string;
  /** Recruiter screening questions from the logged-in application form. */
  questions?: string[];
  salary?: string;
  years_required?: number | null;
  work_format?: string;
  countries?: string;
  english?: string;
  employment?: string;
  domain?: string;
  company_type?: string;
  required_skills?: string;
  published?: string;
  views?: number;
  applications?: number;
  detail_error?: string;
}

// ---------- text helpers ----------

export const decode = (s: string): string =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, "&");

export const toText = (html: string): string =>
  decode(
    html
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<br\s*\/?>|<\/(p|li|h\d|div|tr)>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();

// ---------- RSS ----------

export const rssUrl = (keyword: string) =>
  `https://djinni.co/jobs/rss/?primary_keyword=${encodeURIComponent(keyword)}`;

const field = (block: string, tag: string): string => {
  const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
  return m ? m[1]! : "";
};

/** Cheap first pass: ids, links, dates and titles. Descriptions stay raw until needed. */
export const parseRss = (xml: string, now = Date.now()): RssItem[] => {
  const items: RssItem[] = [];
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const block = m[1]!;
    const link = decode(field(block, "link") || field(block, "guid")).trim();
    const id = (link.match(/\/jobs\/(\d+)-/) || [])[1] ?? link;
    const pubDate = decode(field(block, "pubDate")).trim();
    const posted = pubDate ? new Date(pubDate) : new Date(Number.NaN);
    const valid = !Number.isNaN(posted.getTime());
    items.push({
      id,
      link,
      title: decode(field(block, "title")).trim(),
      pubDate,
      postedAt: valid ? posted.toISOString() : null,
      ageHours: valid ? (now - posted.getTime()) / 36e5 : Number.NaN,
      category: decode(field(block, "category")).trim(),
      rawDescription: field(block, "description"),
    });
  }
  return items;
};

export const descriptionText = (item: RssItem): string => toText(decode(item.rawDescription));

// ---------- filters ----------

const titleExclude = djinniConfig.titleExclude.map((p) => new RegExp(p, "i"));
const mustMatch = djinniConfig.mustMatchAny.map((p) => new RegExp(p, "i"));

export interface Verdict {
  readonly keep: boolean;
  readonly reason: string;
  readonly flags: string[];
}

export const rssVerdict = (item: { title: string; ageHours: number }, description: string): Verdict => {
  const flags: string[] = [];
  if (Number.isNaN(item.ageHours)) flags.push("no-date");
  else if (item.ageHours > djinniConfig.maxAgeHours) return { keep: false, reason: "stale", flags };

  const hit = titleExclude.find((re) => re.test(item.title));
  if (hit) return { keep: false, reason: `title:${hit.source}`, flags };

  const hay = `${item.title}\n${description}`.toLowerCase();
  if (!mustMatch.some((re) => re.test(hay))) return { keep: false, reason: "no-stack-match", flags };

  if (/[Ѐ-ӿ]/.test(description)) flags.push("ua-post");
  if (/\bsenior\b/i.test(item.title)) flags.push("senior");
  if (/\b(junior|trainee|intern)\b/i.test(item.title)) flags.push("junior");
  if (/\b(middle|mid)\b/i.test(item.title)) flags.push("middle");
  if (/part[- ]?time/i.test(hay)) flags.push("part-time");
  if (/\b(astro|tanstack|drizzle|effect[- ]?ts|\bbun\b|hono)\b/i.test(hay)) flags.push("niche-stack");
  if (/\b(claude|cursor|copilot|ai[- ]assisted|ai tools)\b/i.test(hay)) flags.push("ai-tools");
  if (/\b(1-3|one to three|small team|only engineer|sole engineer|founding)\b/i.test(hay)) flags.push("small-team");
  return { keep: true, reason: "", flags };
};

/** Flags that need the job page, plus the skip decision on years required. */
export const detailVerdict = (detail: JobDetail): { skip: boolean; flags: string[] } => {
  const flags: string[] = [];
  const y = detail.years_required;
  if (typeof y === "number" && y > djinniConfig.years.skipAbove) return { skip: true, flags: ["years"] };
  if (typeof y === "number" && y >= djinniConfig.years.stretchFrom) flags.push("stretch-years");
  if (detail.work_format && !/remote/i.test(detail.work_format)) flags.push("not-remote");
  if (detail.countries && /ukraine/i.test(detail.countries) && !/,|worldwide|europe|austria/i.test(detail.countries))
    flags.push("ukraine-only");
  if (detail.company_type && /outstaff|outsourc/i.test(detail.company_type)) flags.push("outstaff");
  return { skip: false, flags };
};

export const isHot = (ageHours: number, detail: JobDetail, flags: string[]): boolean => {
  const y = detail.years_required;
  return (
    (ageHours || 0) <= djinniConfig.hot.maxAgeHours &&
    (y == null || y <= djinniConfig.hot.maxYears) &&
    (detail.applications == null || detail.applications <= djinniConfig.hot.maxApplications) &&
    !flags.includes("not-remote")
  );
};

// ---------- job page ----------

export const parseDetail = (html: string): JobDetail => {
  const lines = toText(html).split("\n");
  const joined = lines.join("\n");
  const d: JobDetail = {};

  const t = html.match(/<title>([\s\S]*?)<\/title>/);
  if (t) {
    const m = decode(t[1]!).match(/^(.*?)\s+at\s+(.*?)\s+[–-]\s+Djinni/);
    if (m) d.company = m[2]!.trim();
  }

  const publishedIdx = lines.findIndex((l) => /^Published\s+\d/.test(l));
  const head = publishedIdx > -1 ? lines.slice(0, publishedIdx) : lines.slice(0, 40);
  const sal = head.find((l) => /^\$(\$*|\s?[\d,]+(?:\s*-\s*\$?[\d,]+)?)$/.test(l));
  if (sal) d.salary = sal;

  const y =
    joined.match(/from\s+(\d+(?:[.,]\d+)?)\s+years?\s+of experience/i) ||
    joined.match(/(\d+(?:[.,]\d+)?)\s+years?\s+of experience/i);
  if (y) d.years_required = Number(y[1]!.replace(",", "."));
  else if (/no experience/i.test(joined)) d.years_required = 0;
  else d.years_required = null;

  const cIdx = lines.findIndex((l) => /^Countries where we consider/i.test(l));
  if (cIdx > 1) {
    const countries = lines[cIdx - 1];
    if (countries) d.countries = countries;
    const wf = lines[cIdx - 2] ?? "";
    if (/remote|office|hybrid|flexible/i.test(wf)) d.work_format = wf;
  }
  if (!d.work_format) {
    const wf = lines.find((l) => /^(Full Remote|Hybrid Remote|Office|Office Work|Remote)$/i.test(l));
    if (wf) d.work_format = wf;
  }

  const e = joined.match(/English\s+(A1|A2|B1|B2|C1|C2)\s*-\s*([A-Za-z -]+)/);
  if (e) d.english = e[1]!;

  const emp = joined.match(/Employment:\s*([^\n]+)/);
  if (emp) d.employment = emp[1]!.trim();
  const dom = lines.findIndex((l) => /^Domain:/.test(l));
  if (dom > -1) {
    d.domain = lines[dom]!.replace(/^Domain:\s*/, "").trim();
    const next = lines[dom + 1];
    if (next && next.length < 24 && !/apply/i.test(next)) d.company_type = next;
  }

  const skills = publishedIdx > 0 ? lines[publishedIdx - 1] : undefined;
  if (skills) d.required_skills = skills;
  const pub = joined.match(/Published\s+(\d{1,2}\s+\w+)/);
  if (pub) d.published = pub[1]!;
  const v = joined.match(/(\d+)\s+views/);
  if (v) d.views = Number(v[1]);
  const a = joined.match(/(\d+)\s+applications?/);
  if (a) d.applications = Number(a[1]);
  return d;
};

// ---------- fetchers ----------

const getText = (client: HttpClient.HttpClient, url: string, accept: string, extra: Record<string, string> = {}) =>
  HttpClientRequest.get(url).pipe(
    HttpClientRequest.setHeaders({ "user-agent": UA, accept, ...extra }),
    client.execute,
    Effect.flatMap(HttpClientResponse.filterStatusOk),
    Effect.flatMap((res) => res.text),
    Effect.timeout("15 seconds"),
    Effect.retry({ schedule: Schedule.exponential("500 millis"), times: 1 }),
    Effect.mapError((cause) => DjinniFetchError.make({ url, cause })),
  );

export const fetchRss = (client: HttpClient.HttpClient, keyword: string) =>
  getText(client, rssUrl(keyword), "application/rss+xml, application/xml, text/xml");

/** With a session cookie the page carries the application form, including the recruiter's questions. */
export const fetchJobPage = (client: HttpClient.HttpClient, url: string, sessionId?: string) =>
  getText(client, url, "text/html", sessionId ? { cookie: `sessionid=${sessionId}` } : {});

/**
 * Screening questions from the application form. `null` means the page was served logged out
 * (so a configured cookie has expired); `[]` means the form has no questions.
 */
export const parseQuestions = (html: string): string[] | null => {
  const loggedOut =
    /name="anon_apply"/.test(html) ||
    /"candidate_id"\s*:\s*""/.test(html) ||
    /<title>[^<]*(?:Log ?in|Вхід|Увійти)[^<]*<\/title>/i.test(html);
  if (loggedOut) return null;
  const start = html.search(/Questions from the recruiter|Питання від рекрутера|Запитання від рекрутера/i);
  if (start < 0) return [];
  const end = html.slice(start).search(/Message\s*(&amp;|&)\s*contact details|Повідомлення та контакт|<\/form>/i);
  const block = html.slice(start, end > 0 ? start + end : start + 20000);
  const labels = [...block.matchAll(/<label[^>]*>([\s\S]*?)<\/label>/gi)]
    .map((m) => toText(m[1]!).replace(/\s+/g, " ").trim())
    .filter((t) => t.length > 3 && !/^(message|повідомлення|email|your name|ім'я)$/i.test(t));
  if (labels.length) return labels;
  // Fallback: question-looking lines in the block's text.
  return toText(block)
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 10 && l.endsWith("?") && !/Questions from the recruiter/i.test(l));
};
