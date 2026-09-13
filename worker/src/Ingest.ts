/**
 * Turning raw sources into `jobs` rows and moving them through new → enriched → scored →
 * carded. Each function does a bounded amount of work so a tick stays inside the CPU budget.
 */
import { Effect } from "effect";

import { draftKeyboard, jobCard, noDraftKeyboard } from "./Cards.ts";
import {
  descriptionText,
  detailVerdict,
  djinniConfig,
  fetchJobPage,
  fetchRss,
  isHot,
  parseDetail,
  parseRss,
  rssVerdict,
  type JobDetail,
} from "./Djinni.ts";
import type { ExtractedJob } from "./Email.ts";
import { EFFECT_JOBS_URL, fetchEffectJobs } from "./EffectJobs.ts";
import { fetchLatestThread, fetchPage } from "./HackerNews.ts";
import { Kv } from "./Kv.ts";
import { HttpClient } from "effect/unstable/http";
import { now, Repo, type DraftRow, type JobRow, type NewJob, type ScoreRow } from "./Repo.ts";
import { detectLanguage, Scorer, type ScoreInput } from "./Scorer.ts";
import { Telegram } from "./Telegram.ts";

const parseJson = <T>(s: string | null, fallback: T): T => {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
};

export const jobFlags = (job: JobRow): string[] => parseJson<string[]>(job.flags, []);
export const jobDetail = (job: JobRow): JobDetail => parseJson<JobDetail>(job.detail, {});

/** The Telegram card for a job, with whatever score and draft exist for it. */
export const cardFor = (job: JobRow, score: ScoreRow | null, draft: DraftRow | null): string =>
  jobCard(
    {
      id: job.id,
      source: job.source,
      title: job.title,
      company: job.company,
      url: job.url,
      postedAt: job.postedAt,
      firstSeenAt: job.firstSeenAt,
      flags: jobFlags(job),
      hot: job.hot === 1,
      detail: jobDetail(job) as Record<string, any>,
    },
    score ? { total: score.total, verdict: score.verdict, summary: score.summary } : null,
    draft ? { id: draft.id, kind: draft.kind, salaryAsk: draft.salaryAsk, resumeVariant: draft.resumeVariant, language: draft.language } : null,
  );

/** One RSS keyword per call: fetch, keep the fresh on-lane items we have not seen, insert. */
export const ingestDjinniKeyword = Effect.fn("Ingest.djinniKeyword")(function* (keyword: string) {
  const client = yield* HttpClient.HttpClient;
  const repo = yield* Repo;
  const xml = yield* fetchRss(client, keyword);
  const items = parseRss(xml);
  const fresh = items.filter((i) => Number.isNaN(i.ageHours) || i.ageHours <= djinniConfig.maxAgeHours);
  const seen = yield* repo.existingJobIds(fresh.map((i) => `djinni:${i.id}`));
  const rows: NewJob[] = [];
  let skipped = 0;
  for (const item of fresh) {
    const id = `djinni:${item.id}`;
    if (seen.has(id)) continue;
    const description = descriptionText(item);
    const verdict = rssVerdict(item, description);
    rows.push({
      id,
      source: "djinni",
      externalId: item.id,
      url: item.link,
      title: item.title,
      description: description.slice(0, 6000),
      postedAt: item.postedAt,
      firstSeenAt: now(),
      updatedAt: now(),
      keywords: JSON.stringify([keyword]),
      flags: JSON.stringify(verdict.flags),
      filterReason: verdict.keep ? null : verdict.reason,
      status: verdict.keep ? "new" : "skipped",
    });
    if (!verdict.keep) skipped++;
  }
  if (rows.length) yield* repo.insertJobs(rows);
  return { keyword, feed: items.length, fresh: fresh.length, inserted: rows.length, kept: rows.length - skipped };
});

/**
 * One page of the current "Who is hiring?" thread per call. The thread id is cached per month;
 * pages are walked with a KV cursor, and page 0 (newest first) comes around again after a full
 * walk so late comments are picked up. Posts land as `enriched` (no page to fetch) and score next.
 */
export const ingestHackerNews = Effect.fn("Ingest.hackerNews")(function* () {
  const client = yield* HttpClient.HttpClient;
  const repo = yield* Repo;
  const kv = yield* Kv;
  const month = new Date().toISOString().slice(0, 7);
  let threadId = yield* kv.get(`hn:thread:${month}`);
  if (!threadId) {
    const thread = yield* fetchLatestThread(client);
    if (!thread) return { thread: null, page: -1, inserted: 0 };
    threadId = thread.id;
    yield* kv.put(`hn:thread:${month}`, threadId, 40 * 86400);
    yield* kv.put("hn:page", "0");
  }
  const page = Number((yield* kv.get("hn:page")) ?? 0);
  const result = yield* fetchPage(client, threadId, page);
  const seen = yield* repo.existingJobIds(result.posts.map((p) => `hn:${p.id}`));
  const rows: NewJob[] = [];
  for (const p of result.posts) {
    const id = `hn:${p.id}`;
    if (seen.has(id)) continue;
    const skip = p.flags.includes("us-only") || p.flags.includes("onsite");
    rows.push({
      id,
      source: "hn",
      externalId: p.id,
      url: p.url,
      title: p.title,
      description: p.text,
      postedAt: p.createdAt,
      firstSeenAt: now(),
      updatedAt: now(),
      keywords: JSON.stringify([`hn:${threadId}`]),
      flags: JSON.stringify(p.flags),
      filterReason: skip ? (p.flags.includes("us-only") ? "us-only" : "onsite") : null,
      status: skip ? "skipped" : "enriched",
      hot: p.flags.includes("niche-stack") ? 1 : 0,
      detail: JSON.stringify({ detail_error: "hn-comment", work_format: "Remote" }),
    });
  }
  if (rows.length) yield* repo.insertJobs(rows);
  const next = result.pages > 0 ? (page + 1) % result.pages : 0;
  yield* kv.put("hn:page", String(next));
  return { thread: threadId, page, pages: result.pages, kept: result.posts.length, inserted: rows.length };
});

/** The Effect job directory, once a day. New remote cards land hot; on-site ones are stored skipped. */
export const ingestEffectJobs = Effect.fn("Ingest.effectJobs")(function* () {
  const client = yield* HttpClient.HttpClient;
  const repo = yield* Repo;
  const jobs = yield* fetchEffectJobs(client);
  const seen = yield* repo.existingJobIds(jobs.map((j) => `effect:${j.id}`));
  const rows: NewJob[] = [];
  for (const j of jobs) {
    const id = `effect:${j.id}`;
    if (seen.has(id)) continue;
    const skip = !j.remote || j.flags.includes("us-only") || j.flags.includes("intern");
    rows.push({
      id,
      source: "effect",
      externalId: j.id,
      url: j.applyUrl,
      title: `${j.company} · ${j.role}`,
      description: [j.blurb, j.pay ? `Pay: ${j.pay}` : null, `Location: ${j.location}`, `Directory: ${EFFECT_JOBS_URL}`].filter(Boolean).join("\n"),
      postedAt: now(),
      firstSeenAt: now(),
      updatedAt: now(),
      keywords: JSON.stringify(["effect-jobs"]),
      flags: JSON.stringify(j.flags),
      filterReason: skip ? (j.remote ? (j.flags.includes("intern") ? "intern" : "us-only") : "onsite") : null,
      status: skip ? "skipped" : "enriched",
      hot: skip ? 0 : 1,
      company: j.company,
      detail: JSON.stringify({ detail_error: "directory-card", work_format: j.remote ? "Remote" : "On-site", countries: j.location, salary: j.pay ?? undefined }),
    });
  }
  if (rows.length) yield* repo.insertJobs(rows);
  return { cards: jobs.length, inserted: rows.length };
});

/** Jobs that arrived by email already carry all we will ever know; they skip the page fetch. */
export const ingestExtracted = Effect.fn("Ingest.extracted")(function* (extracted: ReadonlyArray<ExtractedJob>) {
  const repo = yield* Repo;
  const seen = yield* repo.existingJobIds(extracted.map((j) => `${j.source}:${j.externalId}`));
  const rows: NewJob[] = [];
  for (const j of extracted) {
    const id = `${j.source}:${j.externalId}`;
    if (seen.has(id)) continue;
    const verdict = rssVerdict({ title: j.title, ageHours: 0 }, j.snippet);
    rows.push({
      id,
      source: j.source,
      externalId: j.externalId,
      url: j.url,
      title: j.title,
      description: j.snippet,
      postedAt: now(),
      firstSeenAt: now(),
      updatedAt: now(),
      keywords: JSON.stringify(["email"]),
      flags: JSON.stringify(verdict.flags),
      filterReason: verdict.keep ? null : verdict.reason,
      status: verdict.keep ? (j.source === "djinni" ? "new" : "enriched") : "skipped",
      hot: j.source === "djinni" ? 0 : 1,
      detail: j.source === "djinni" ? null : JSON.stringify({ detail_error: "email-only" }),
    });
  }
  if (rows.length) yield* repo.insertJobs(rows);
  return rows.length;
});

/** Fetch the public Djinni page for up to `limit` new jobs, politely spaced. */
export const enrichDjinni = Effect.fn("Ingest.enrichDjinni")(function* (limit: number) {
  const client = yield* HttpClient.HttpClient;
  const repo = yield* Repo;
  const batch = yield* repo.jobsByStatus("new", limit, "djinni");
  let done = 0;
  for (const job of batch) {
    const detail = yield* fetchJobPage(client, job.url).pipe(
      Effect.map(parseDetail),
      Effect.catch((err) => Effect.succeed<JobDetail>({ detail_error: String(err) })),
    );
    const dv = detailVerdict(detail);
    const allFlags = [...jobFlags(job), ...dv.flags];
    const ageHours = job.postedAt ? (Date.now() - new Date(job.postedAt).getTime()) / 36e5 : Number.NaN;
    yield* repo.updateJob(
      job.id,
      {
        company: detail.company ?? job.company,
        detail: JSON.stringify(detail),
        flags: JSON.stringify(allFlags),
        hot: isHot(ageHours, detail, allFlags) ? 1 : 0,
        status: dv.skip ? "skipped" : "enriched",
        filterReason: dv.skip ? "years" : job.filterReason,
      },
      "new",
    );
    done++;
    yield* Effect.sleep(`${1000 + Math.floor(Math.random() * 1500)} millis`);
  }
  return done;
});

/** Score up to `limit` enriched jobs; three failed attempts park a job as unscored. */
export const scoreEnriched = Effect.fn("Ingest.scoreEnriched")(function* (limit: number) {
  const repo = yield* Repo;
  const scorer = yield* Scorer;
  const batch = yield* repo.jobsByStatus("enriched", limit);
  let scored = 0;
  for (const job of batch) {
    const input: ScoreInput = {
      title: job.title,
      company: job.company,
      source: job.source,
      description: job.description,
      detail: jobDetail(job) as Record<string, unknown>,
      flags: jobFlags(job),
      language: detectLanguage(`${job.title}\n${job.description}`),
    };
    const result = yield* scorer.score(input).pipe(
      Effect.map((r) => ({ ok: true as const, r })),
      Effect.catch((err) => Effect.succeed({ ok: false as const, err })),
    );
    if (!result.ok) {
      yield* Effect.logWarning("score failed", { job: job.id, err: String(result.err) });
      yield* repo.bumpScoreAttempts(job.id);
      const s = yield* repo.scoreByJob(job.id);
      if ((s?.attempts ?? 0) >= 3) yield* repo.updateJob(job.id, { status: "skipped", filterReason: "unscored" }, "enriched");
      continue;
    }
    const r = result.r;
    yield* repo.upsertScore({
      jobId: job.id,
      skillsFit: r.skills_fit,
      winnability: r.winnability,
      stackability: r.stackability,
      signal: r.signal,
      total: r.total,
      verdict: r.verdict,
      language: r.language,
      summary: r.summary,
      model: r.model,
      attempts: 1,
      raw: null,
      scoredAt: now(),
    });
    yield* repo.updateJob(
      job.id,
      { status: r.verdict === "skip" ? "skipped" : "scored", filterReason: r.verdict === "skip" ? "score" : job.filterReason },
      "enriched",
    );
    scored++;
  }
  return scored;
});

/** Card scored jobs that have no card yet, so hot ones reach Dan before the routine drafts them. */
export const cardScored = Effect.fn("Ingest.cardScored")(function* (limit: number) {
  const repo = yield* Repo;
  const telegram = yield* Telegram;
  const rows = yield* repo.jobsWithoutCard(limit);
  let sent = 0;
  for (const { job, score } of rows) {
    const messageId = yield* telegram
      .send(cardFor(job, score, null), { keyboard: noDraftKeyboard(job.id), silent: job.hot !== 1 })
      .pipe(Effect.catch((err) => Effect.logWarning("card send failed", { err: String(err) }).pipe(Effect.as(-1))));
    if (messageId > 0) {
      yield* repo.updateJob(job.id, { tgMessageId: messageId });
      yield* repo.insertEvent({ jobId: job.id, kind: "card", at: now() });
      sent++;
    }
  }
  return sent;
});

/** Drafts still `pending` (their send failed, or Telegram was not configured yet) get their card here. */
export const cardPendingDrafts = Effect.fn("Ingest.cardPendingDrafts")(function* (limit: number) {
  const repo = yield* Repo;
  const telegram = yield* Telegram;
  if (!telegram.configured || !telegram.chatId) return 0;
  const pending = yield* repo.draftsByStatus("pending", limit, "application");
  let sent = 0;
  for (const draft of pending) {
    if (!draft.jobId) continue;
    const job = yield* repo.jobById(draft.jobId);
    if (!job) continue;
    const score = yield* repo.scoreByJob(job.id);
    const mid = yield* telegram
      .send(cardFor(job, score, draft), { keyboard: draftKeyboard(draft.id), silent: job.hot !== 1 })
      .pipe(Effect.catch((err) => Effect.logWarning("draft card failed", { err: String(err) }).pipe(Effect.as(-1))));
    if (mid > 0) {
      yield* repo.updateDraft(draft.id, { status: "carded", tgMessageId: mid }, "pending");
      yield* repo.insertEvent({ jobId: job.id, draftId: draft.id, kind: "card", at: now() });
      sent++;
    }
  }
  return sent;
});
