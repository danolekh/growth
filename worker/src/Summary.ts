/**
 * The daily and weekly texts. Templates over repository counts; no model involved.
 */
import { Effect } from "effect";

import { draftKeyboard, jobCard } from "./Cards.ts";
import { now } from "./Db.ts";
import type { Deps } from "./Deps.ts";
import { jobDetail, jobFlags } from "./Ingest.ts";
import { escapeHtml } from "./Telegram.ts";
import { localTime } from "./Time.ts";

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

export const dailySummary = (deps: Deps) =>
  Effect.gen(function* () {
    const local = localTime();
    const s = yield* deps.repo.stats(daysAgo(1), daysAgo(7));
    const bySource = s.newSince.map((r) => `${r.source} ${r.n}`).join(", ") || "none";
    const lines = [
      `<b>Hunt summary · ${local.date}</b>`,
      `New in 24h: ${escapeHtml(bySource)} · scored ${s.scoredSince}`,
      `Awaiting a draft: ${s.awaitingDraft} · cards open: ${s.carded} · parked (later): ${s.later}`,
      `Sent this week: ${s.sentWeek} · conversations alive: ${s.replies}`,
      s.inbound ? `Inbound mail in 24h: ${s.inbound}` : null,
      s.repliesRequested ? `Replies waiting for the routine: ${s.repliesRequested}` : null,
      s.unscored ? `Could not score: ${s.unscored} (model errors, see /queue)` : null,
    ].filter(Boolean);
    yield* deps.telegram.send(lines.join("\n"));

    // Parked drafts come back once a day, as fresh cards.
    const later = yield* deps.repo.laterDrafts(5);
    for (const d of later) {
      if (!d.jobId) continue;
      const job = yield* deps.repo.jobById(d.jobId);
      if (!job) continue;
      const sc = yield* deps.repo.scoreByJob(job.id);
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
        sc ? { total: sc.total, verdict: sc.verdict, summary: sc.summary } : null,
        { id: d.id, kind: d.kind, salaryAsk: d.salaryAsk, resumeVariant: d.resumeVariant, language: d.language },
      );
      const mid = yield* deps.telegram.send(text, { keyboard: draftKeyboard(d.id), silent: true });
      yield* deps.repo.updateDraft(d.id, { status: "carded", tgMessageId: mid > 0 ? mid : d.tgMessageId }, "later");
    }
  });

export const weeklySummary = (deps: Deps) =>
  Effect.gen(function* () {
    const local = localTime();
    const s = yield* deps.repo.stats(daysAgo(7), daysAgo(7));
    const bySource = s.newSince.map((r) => `${r.source} ${r.n}`).join(", ") || "none";
    const text = [
      `<b>Week ${local.isoWeek} in review</b>`,
      `Seen: ${escapeHtml(bySource)}`,
      `Sent: ${s.sentWeek} · replies/calls/tests/offers alive: ${s.replies}`,
      `Still awaiting drafts: ${s.awaitingDraft} · parked: ${s.later}`,
      "Sunday rule: change one thing this week, and only one.",
    ].join("\n");
    yield* deps.telegram.send(text);
  });

/** Runs once a day, right after the summary: expire stale jobs, mark silent applications. */
export const housekeeping = (deps: Deps) =>
  Effect.gen(function* () {
    const expired = yield* deps.repo.expireStale(daysAgo(7));
    const silent = yield* deps.repo.markSilent(daysAgo(14));
    yield* deps.repo.insertEvent({ kind: "housekeeping", payload: JSON.stringify({ expired, silent }), at: now() });
    return { expired, silent };
  });
