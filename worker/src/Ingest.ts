/**
 * Turning raw sources into `jobs` rows, and moving rows through new → enriched → scored.
 * Each function does a bounded amount of work so a tick stays under the CPU budget.
 */
import { Effect } from "effect";

import { jobCard, noDraftKeyboard } from "./Cards.ts";
import { now, type JobRow, type NewJob } from "./Db.ts";
import type { Deps } from "./Deps.ts";
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
import { score, type ScoreInput } from "./Score.ts";
import type { ExtractedJob } from "./Email.ts";

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

/** One RSS keyword per call: fetch, keep the fresh on-lane items we have not seen, insert. */
export const ingestDjinniKeyword = (deps: Deps, keyword: string) =>
  Effect.gen(function* () {
    const xml = yield* fetchRss(deps.http, keyword);
    const items = parseRss(xml);
    const fresh = items.filter((i) => Number.isNaN(i.ageHours) || i.ageHours <= djinniConfig.maxAgeHours);
    const ids = fresh.map((i) => `djinni:${i.id}`);
    const seen = yield* deps.repo.existingJobIds(ids);
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
    if (rows.length) yield* deps.repo.insertJobs(rows);
    return { keyword, feed: items.length, fresh: fresh.length, inserted: rows.length, kept: rows.length - skipped };
  });

/** Jobs that arrived by email already carry all we will ever know; they go straight to enriched. */
export const ingestExtracted = (deps: Deps, extracted: ExtractedJob[]) =>
  Effect.gen(function* () {
    const ids = extracted.map((j) => `${j.source}:${j.externalId}`);
    const seen = yield* deps.repo.existingJobIds(ids);
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
        // Djinni ones get the page fetch like RSS jobs; the others cannot be fetched.
        status: verdict.keep ? (j.source === "djinni" ? "new" : "enriched") : "skipped",
        hot: j.source === "djinni" ? 0 : 1,
        detail: j.source === "djinni" ? null : JSON.stringify({ detail_error: "email-only" }),
      });
    }
    if (rows.length) yield* deps.repo.insertJobs(rows);
    return rows.length;
  });

/** Fetch the public Djinni page for up to `limit` new jobs. */
export const enrichDjinni = (deps: Deps, limit: number) =>
  Effect.gen(function* () {
    const batch = yield* deps.repo.jobsByStatus("new", limit, "djinni");
    let done = 0;
    for (const job of batch) {
      const detail = yield* fetchJobPage(deps.http, job.url).pipe(
        Effect.map(parseDetail),
        Effect.catch((err) => Effect.succeed<JobDetail>({ detail_error: String(err) })),
      );
      const flags = jobFlags(job);
      const dv = detailVerdict(detail);
      const allFlags = [...flags, ...dv.flags];
      const ageHours = job.postedAt ? (Date.now() - new Date(job.postedAt).getTime()) / 36e5 : Number.NaN;
      yield* deps.repo.updateJob(
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
export const scoreEnriched = (deps: Deps, limit: number) =>
  Effect.gen(function* () {
    const batch = yield* deps.repo.jobsByStatus("enriched", limit);
    let scored = 0;
    for (const job of batch) {
      const input: ScoreInput = {
        title: job.title,
        company: job.company,
        source: job.source,
        description: job.description,
        detail: jobDetail(job) as Record<string, unknown>,
        flags: jobFlags(job),
      };
      const result = yield* score(deps.ai, deps.http, deps.settings.openRouterKey, input).pipe(
        Effect.map((r) => ({ ok: true as const, r })),
        Effect.catch((err) => Effect.succeed({ ok: false as const, err })),
      );
      if (!result.ok) {
        yield* Effect.logWarning("score failed", { job: job.id, err: String(result.err) });
        yield* deps.repo.bumpScoreAttempts(job.id);
        const s = yield* deps.repo.scoreByJob(job.id);
        if ((s?.attempts ?? 0) >= 3) yield* deps.repo.updateJob(job.id, { status: "skipped", filterReason: "unscored" }, "enriched");
        continue;
      }
      const r = result.r;
      yield* deps.repo.upsertScore({
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
      yield* deps.repo.updateJob(
        job.id,
        { status: r.verdict === "skip" ? "skipped" : "scored", filterReason: r.verdict === "skip" ? "score" : job.filterReason },
        "enriched",
      );
      scored++;
    }
    return scored;
  });

/** Card scored jobs that have no card yet, so hot ones reach Dan before the routine drafts them. */
export const cardScored = (deps: Deps, limit: number) =>
  Effect.gen(function* () {
    const rows = yield* deps.repo.jobsWithoutCard(limit);
    let sent = 0;
    for (const { job, score: s } of rows) {
      const text = jobCard(
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
        { total: s.total, verdict: s.verdict, summary: s.summary },
        null,
      );
      const messageId = yield* deps.telegram
        .send(text, { keyboard: noDraftKeyboard(job.id), silent: job.hot !== 1 })
        .pipe(Effect.catch((err) => Effect.logWarning("card send failed", { err: String(err) }).pipe(Effect.as(-1))));
      if (messageId > 0) {
        yield* deps.repo.updateJob(job.id, { tgMessageId: messageId });
        yield* deps.repo.insertEvent({ jobId: job.id, kind: "card", at: now() });
        sent++;
      }
    }
    return sent;
  });
