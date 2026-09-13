#!/usr/bin/env bun
/**
 * Djinni watcher.
 *
 * Pulls the public RSS feeds for the keyword lanes in config.json, keeps postings that match
 * Dan's stack and are fresh, enriches each survivor from its public job page (company, salary
 * band, years required, work format, countries, English level, applications, views), and writes:
 *
 *   inbox/djinni-<timestamp>.json   the new jobs, full detail, for Claude to triage
 *   reports/djinni-<timestamp>.md   a human digest, hot matches first
 *   state/seen.json                 ids already processed (so the next run only shows new ones)
 *
 * Read-only and polite: six RSS fetches plus at most detail.maxPerRun page fetches with
 * randomized delays. It never applies to anything.
 *
 *   bun run watch                # new jobs only
 *   bun run watch --all          # ignore the seen-list
 *   bun run watch --no-detail    # RSS only, no page fetches
 *   bun run watch --limit 10     # cap detail fetches this run
 *   bun run watch --quiet        # no macOS notification
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Cfg = {
  keywords: string[];
  maxAgeHours: number;
  titleExclude: string[];
  mustMatchAny: string[];
  years: { stretchFrom: number; skipAbove: number };
  detail: { enabled: boolean; maxPerRun: number; delayMs: [number, number] };
  hot: { maxAgeHours: number; maxApplications: number; maxYears: number };
  notify: boolean;
};

type RssJob = {
  id: string;
  link: string;
  title: string;
  descriptionText: string;
  pubDate: string;
  postedAt: string;
  ageHours: number;
  category: string;
  keywords: string[];
};

type Detail = {
  company?: string;
  salary?: string;
  yearsRequired?: number | null;
  workFormat?: string;
  countries?: string;
  english?: string;
  employment?: string;
  domain?: string;
  companyType?: string;
  requiredSkills?: string;
  published?: string;
  views?: number;
  applications?: number;
  detailError?: string;
};

type Job = RssJob & Detail & { flags: string[]; hot: boolean };

const ROOT = import.meta.dir;
const argv = process.argv.slice(2);
const has = (f: string) => argv.includes(f);
const optNum = (f: string) => {
  const i = argv.indexOf(f);
  return i > -1 ? Number(argv[i + 1]) : undefined;
};

const cfg = JSON.parse(readFileSync(join(ROOT, "config.json"), "utf8")) as Cfg;
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const dirs = {
  inbox: join(ROOT, "inbox"),
  reports: join(ROOT, "reports"),
  state: join(ROOT, "state"),
};
for (const d of Object.values(dirs)) mkdirSync(d, { recursive: true });

const seenFile = join(dirs.state, "seen.json");
const seen: Record<string, string> = existsSync(seenFile)
  ? JSON.parse(readFileSync(seenFile, "utf8"))
  : {};

// ---------- text helpers ----------

const decode = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&");

const toText = (html: string) =>
  decode(
    html
      .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, " ")
      .replace(/<br\s*\/?>|<\/(p|li|h\d|div|tr)>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const jitter = ([a, b]: [number, number]) => a + Math.random() * (b - a);
const hours = (ms: number) => Math.round((ms / 36e5) * 10) / 10;

async function get(url: string) {
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "text/html,application/xml" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// ---------- RSS ----------

async function fetchRss(keyword: string): Promise<RssJob[]> {
  const url = `https://djinni.co/jobs/rss/?primary_keyword=${encodeURIComponent(keyword)}`;
  const xml = await get(url);
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
  const now = Date.now();
  return items.map((it) => {
    const field = (tag: string) => {
      const m = it.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
      return m ? decode(m[1]).trim() : "";
    };
    const link = field("link") || field("guid");
    const id = (link.match(/\/jobs\/(\d+)-/) || [])[1] || link;
    const pubDate = field("pubDate");
    const posted = pubDate ? new Date(pubDate) : new Date(NaN);
    return {
      id,
      link,
      title: field("title"),
      descriptionText: toText(field("description")),
      pubDate,
      postedAt: Number.isNaN(posted.getTime()) ? "" : posted.toISOString(),
      ageHours: Number.isNaN(posted.getTime()) ? Number.NaN : hours(now - posted.getTime()),
      category: field("category"),
      keywords: [keyword],
    };
  });
}

// ---------- filters ----------

const titleExclude = cfg.titleExclude.map((p) => new RegExp(p, "i"));
const mustMatch = cfg.mustMatchAny.map((p) => new RegExp(p, "i"));

function rssVerdict(job: RssJob): { keep: boolean; reason: string; flags: string[] } {
  const flags: string[] = [];
  if (Number.isNaN(job.ageHours)) flags.push("no-date");
  else if (job.ageHours > cfg.maxAgeHours) return { keep: false, reason: "stale", flags };

  const hit = titleExclude.find((re) => re.test(job.title));
  if (hit) return { keep: false, reason: `title:${hit.source}`, flags };

  const hay = `${job.title}\n${job.descriptionText}`.toLowerCase();
  if (!mustMatch.some((re) => re.test(hay))) return { keep: false, reason: "no-stack-match", flags };

  if (/[\u0400-\u04FF]/.test(job.descriptionText)) flags.push("ua-post");
  if (/\bsenior\b/i.test(job.title)) flags.push("senior");
  if (/\b(junior|trainee|intern)\b/i.test(job.title)) flags.push("junior");
  if (/\b(middle|mid)\b/i.test(job.title)) flags.push("middle");
  if (/part[- ]?time/i.test(hay)) flags.push("part-time");
  if (/\b(astro|tanstack|drizzle|effect|bun|hono)\b/i.test(hay)) flags.push("niche-stack");
  if (/\b(claude|cursor|copilot|ai[- ]assisted|ai tools)\b/i.test(hay)) flags.push("ai-tools");
  if (/\b(1-3|one to three|small team|only engineer|sole engineer|founding)\b/i.test(hay)) flags.push("small-team");
  return { keep: true, reason: "", flags };
}

// ---------- detail page ----------

async function fetchDetail(link: string): Promise<Detail> {
  const html = await get(link);
  const lines = toText(html).split("\n");
  const joined = lines.join("\n");
  const d: Detail = {};

  const t = html.match(/<title>([\s\S]*?)<\/title>/);
  if (t) {
    const m = decode(t[1]).match(/^(.*?)\s+at\s+(.*?)\s+[–-]\s+Djinni/);
    if (m) d.company = m[2].trim();
  }

  const publishedIdx = lines.findIndex((l) => /^Published\s+\d/.test(l));
  const head = publishedIdx > -1 ? lines.slice(0, publishedIdx) : lines.slice(0, 40);
  const sal = head.find((l) => /^\$(\$*|\s?[\d,]+(?:\s*-\s*\$?[\d,]+)?)$/.test(l));
  if (sal) d.salary = sal;

  const y = joined.match(/from\s+(\d+(?:[.,]\d+)?)\s+years?\s+of experience/i) ||
    joined.match(/(\d+(?:[.,]\d+)?)\s+years?\s+of experience/i);
  if (y) d.yearsRequired = Number(y[1].replace(",", "."));
  else if (/no experience/i.test(joined)) d.yearsRequired = 0;
  else d.yearsRequired = null;

  const cIdx = lines.findIndex((l) => /^Countries where we consider/i.test(l));
  if (cIdx > 1) {
    d.countries = lines[cIdx - 1];
    const wf = lines[cIdx - 2];
    if (/remote|office|hybrid|flexible/i.test(wf)) d.workFormat = wf;
  }
  if (!d.workFormat) {
    const wf = lines.find((l) => /^(Full Remote|Hybrid Remote|Office|Office Work|Remote)$/i.test(l));
    if (wf) d.workFormat = wf;
  }

  const e = joined.match(/English\s+(A1|A2|B1|B2|C1|C2)\s*-\s*([A-Za-z -]+)/);
  if (e) d.english = e[1];

  const emp = joined.match(/Employment:\s*([^\n]+)/);
  if (emp) d.employment = emp[1].trim();
  const dom = lines.findIndex((l) => /^Domain:/.test(l));
  if (dom > -1) {
    d.domain = lines[dom].replace(/^Domain:\s*/, "").trim();
    const next = lines[dom + 1];
    if (next && next.length < 24 && !/apply/i.test(next)) d.companyType = next;
  }

  if (publishedIdx > 0) d.requiredSkills = lines[publishedIdx - 1];
  const pub = joined.match(/Published\s+(\d{1,2}\s+\w+)/);
  if (pub) d.published = pub[1];
  const v = joined.match(/(\d+)\s+views/);
  if (v) d.views = Number(v[1]);
  const a = joined.match(/(\d+)\s+applications?/);
  if (a) d.applications = Number(a[1]);
  return d;
}

// ---------- main ----------

async function main() {
  const startedAt = new Date();
  const stamp = startedAt.toISOString().replace(/[:.]/g, "-");
  const ignoreSeen = has("--all");
  const withDetail = cfg.detail.enabled && !has("--no-detail");
  const limit = optNum("--limit") ?? cfg.detail.maxPerRun;

  const byId = new Map<string, RssJob>();
  for (const kw of cfg.keywords) {
    try {
      const jobs = await fetchRss(kw);
      for (const j of jobs) {
        const prev = byId.get(j.id);
        if (prev) prev.keywords.push(kw);
        else byId.set(j.id, j);
      }
      console.log(`rss ${kw}: ${jobs.length} items`);
    } catch (err) {
      console.error(`rss ${kw} failed: ${(err as Error).message}`);
    }
    await sleep(jitter([600, 1400]));
  }

  const skipped: Record<string, number> = {};
  const candidates: { job: RssJob; flags: string[] }[] = [];
  let alreadySeen = 0;
  for (const job of byId.values()) {
    if (!ignoreSeen && seen[job.id]) {
      alreadySeen++;
      continue;
    }
    const v = rssVerdict(job);
    seen[job.id] = startedAt.toISOString().slice(0, 10);
    if (!v.keep) {
      const key = v.reason.split(":")[0];
      skipped[key] = (skipped[key] ?? 0) + 1;
      continue;
    }
    candidates.push({ job, flags: v.flags });
  }
  candidates.sort((a, b) => (a.job.ageHours || 0) - (b.job.ageHours || 0));

  const jobs: Job[] = [];
  let fetched = 0;
  for (const { job, flags } of candidates) {
    let detail: Detail = {};
    if (withDetail && fetched < limit) {
      try {
        detail = await fetchDetail(job.link);
      } catch (err) {
        detail = { detailError: (err as Error).message };
      }
      fetched++;
      await sleep(jitter(cfg.detail.delayMs));
    } else if (withDetail) {
      detail = { detailError: "skipped (run limit)" };
    }

    const y = detail.yearsRequired;
    if (typeof y === "number" && y > cfg.years.skipAbove) {
      skipped.years = (skipped.years ?? 0) + 1;
      continue;
    }
    if (typeof y === "number" && y >= cfg.years.stretchFrom) flags.push("stretch-years");
    if (detail.workFormat && !/remote/i.test(detail.workFormat)) flags.push("not-remote");
    if (detail.countries && /ukraine/i.test(detail.countries) && !/,|worldwide|europe|austria/i.test(detail.countries))
      flags.push("ukraine-only");
    if (detail.companyType && /outstaff|outsourc/i.test(detail.companyType)) flags.push("outstaff");

    const hot =
      (job.ageHours || 0) <= cfg.hot.maxAgeHours &&
      (y == null || y <= cfg.hot.maxYears) &&
      (detail.applications == null || detail.applications <= cfg.hot.maxApplications) &&
      !flags.includes("not-remote");
    jobs.push({ ...job, ...detail, flags, hot });
  }
  jobs.sort((a, b) => Number(b.hot) - Number(a.hot) || (a.ageHours || 0) - (b.ageHours || 0));

  writeFileSync(seenFile, JSON.stringify(seen, null, 0));

  const summary = {
    fetchedAt: startedAt.toISOString(),
    keywords: cfg.keywords,
    feedItems: byId.size,
    alreadySeen,
    skipped,
    kept: jobs.length,
    hot: jobs.filter((j) => j.hot).length,
    detailFetched: fetched,
  };

  if (jobs.length === 0) {
    console.log(`nothing new (${byId.size} feed items, ${alreadySeen} seen, skipped ${JSON.stringify(skipped)})`);
    return;
  }

  const inboxPath = join(dirs.inbox, `djinni-${stamp}.json`);
  writeFileSync(inboxPath, JSON.stringify({ ...summary, jobs }, null, 2));

  const fmtAge = (h: number) => (Number.isNaN(h) ? "?" : h < 24 ? `${Math.round(h)}h` : `${(h / 24).toFixed(1)}d`);
  const rows = jobs.map((j, i) => {
    const title = j.title.replace(/\|/g, "/");
    const name = `${j.hot ? "🔥 " : ""}[${title}](${j.link})`;
    const comp = (j.company ?? "?").replace(/\|/g, "/");
    const yrs = j.yearsRequired == null ? "?" : `${j.yearsRequired}y`;
    const fmt = [j.workFormat, j.countries].filter(Boolean).join(" · ") || "?";
    const apps = j.applications == null ? "?" : `${j.applications}/${j.views ?? "?"}`;
    return `| ${i + 1} | ${name} | ${comp} | ${j.salary ?? "?"} | ${yrs} | ${fmt} | ${j.english ?? "?"} | ${apps} | ${fmtAge(j.ageHours)} | ${j.flags.join(" ")} |`;
  });
  const md = [
    `# Djinni hunt — ${startedAt.toISOString().slice(0, 16).replace("T", " ")} UTC`,
    "",
    `${summary.feedItems} feed items · ${summary.alreadySeen} already seen · ${jobs.length} new kept · ${summary.hot} hot · skipped ${Object.entries(skipped)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ")}`,
    "",
    "Hot = under 24h, ≤3 years required, ≤80 applications, remote. Apps column = applications/views.",
    "",
    "| # | Job | Company | Salary | Yrs | Format · countries | Eng | Apps | Age | Flags |",
    "|---|---|---|---|---|---|---|---|---|---|",
    ...rows,
    "",
    `Inbox: \`${inboxPath.replace(ROOT, "djinni")}\``,
    "",
  ].join("\n");
  const reportPath = join(dirs.reports, `djinni-${stamp}.md`);
  writeFileSync(reportPath, md);

  console.log(md);
  console.log(`\nwrote ${inboxPath}\nwrote ${reportPath}`);

  if (cfg.notify && !has("--quiet") && summary.hot > 0 && process.platform === "darwin") {
    const top = jobs.filter((j) => j.hot).slice(0, 3).map((j) => `${j.title} @ ${j.company ?? "?"}`).join(" · ");
    const msg = `${summary.hot} hot: ${top}`.replace(/["\\]/g, "");
    Bun.spawn(["osascript", "-e", `display notification "${msg}" with title "Djinni watcher" sound name "Glass"`]);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
