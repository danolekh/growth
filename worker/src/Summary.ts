/**
 * The daily and weekly texts, plus the once-a-day housekeeping. Templates over repository
 * counts; no model involved.
 */
import { Effect } from "effect";

import { draftKeyboard } from "./Cards.ts";
import { cardFor } from "./Ingest.ts";
import { Kv } from "./Kv.ts";
import { now, Repo } from "./Repo.ts";
import { escapeHtml, Telegram } from "./Telegram.ts";
import { localTime } from "./Time.ts";

const daysAgo = (n: number) => new Date(Date.now() - n * 86400000).toISOString();

export const dailySummary = Effect.fn("Summary.daily")(function* () {
  const repo = yield* Repo;
  const telegram = yield* Telegram;
  const local = localTime();
  const s = yield* repo.stats(daysAgo(1), daysAgo(7));
  const bySource = s.newSince.map((r) => `${r.source} ${r.n}`).join(", ") || "none";
  const lines = [
    `<b>Hunt summary · ${local.date}</b>`,
    `New in 24h: ${escapeHtml(bySource)} · scored ${s.scoredSince}`,
    `Awaiting a draft: ${s.awaitingDraft} · cards open: ${s.carded} · parked (later): ${s.later}`,
    `Sent this week: ${s.sentWeek} · conversations alive: ${s.replies}`,
    s.approved ? `Packages open, not yet marked Applied: ${s.approved}` : null,
    s.inbound ? `Inbound mail in 24h: ${s.inbound}` : null,
    s.repliesRequested ? `Replies waiting for the routine: ${s.repliesRequested}` : null,
    s.unscored ? `Could not score: ${s.unscored} (model errors, see /queue)` : null,
  ].filter(Boolean);
  const kv = yield* Kv;
  if (yield* kv.get("djinni:cookie-expired")) lines.push("⚠️ Djinni session cookie expired: refresh DJINNI_SESSION in worker/.env and redeploy.");
  yield* telegram.send(lines.join("\n"));

  // Parked drafts come back once a day, as fresh cards.
  const later = yield* repo.laterDrafts(5);
  for (const draft of later) {
    if (!draft.jobId) continue;
    const job = yield* repo.jobById(draft.jobId);
    if (!job) continue;
    const score = yield* repo.scoreByJob(job.id);
    const mid = yield* telegram.send(cardFor(job, score, draft), { keyboard: draftKeyboard(draft.id), silent: true });
    yield* repo.updateDraft(draft.id, { status: "carded", tgMessageId: mid > 0 ? mid : draft.tgMessageId }, "later");
  }
});

export const weeklySummary = Effect.fn("Summary.weekly")(function* () {
  const repo = yield* Repo;
  const telegram = yield* Telegram;
  const local = localTime();
  const s = yield* repo.stats(daysAgo(7), daysAgo(7));
  const bySource = s.newSince.map((r) => `${r.source} ${r.n}`).join(", ") || "none";
  yield* telegram.send(
    [
      `<b>Week ${local.isoWeek} in review</b>`,
      `Seen: ${escapeHtml(bySource)}`,
      `Sent: ${s.sentWeek} · replies/calls/tests/offers alive: ${s.replies}`,
      `Still awaiting drafts: ${s.awaitingDraft} · parked: ${s.later}`,
      "Sunday rule: change one thing this week, and only one.",
    ].join("\n"),
  );
});

/** Runs once a day, right after the summary: expire stale jobs, mark silent applications. */
export const housekeeping = Effect.fn("Summary.housekeeping")(function* () {
  const repo = yield* Repo;
  const expired = yield* repo.expireStale(daysAgo(7));
  const silent = yield* repo.markSilent(daysAgo(14));
  yield* repo.insertEvent({ kind: "housekeeping", payload: JSON.stringify({ expired, silent }), at: now() });
  return { expired, silent };
});
