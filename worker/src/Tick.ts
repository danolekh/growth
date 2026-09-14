/**
 * The five-minute tick. One cron trigger, one bounded chunk of work per fire, dispatched by
 * Vienna wall clock: one RSS keyword, a few page fetches, a few scores, a few cards, maybe a
 * routine fire, and the daily or weekly summary when its slot comes around.
 *
 * Cloudflare delivers crons at least once, so every tick takes a KV lock keyed by its
 * five-minute slot and a summary takes a lock keyed by its date.
 */
import { Effect } from "effect";

import { djinniConfig } from "./Djinni.ts";
import { cardPendingDrafts, cardScored, enrichDjinni, ingestDjinniKeyword, ingestEffectJobs, ingestHackerNews, scoreEnriched } from "./Ingest.ts";
import { Kv } from "./Kv.ts";
import { now, Repo } from "./Repo.ts";
import { Routine } from "./Routine.ts";
import { Settings } from "./Settings.ts";
import { dailySummary, housekeeping, weeklySummary } from "./Summary.ts";
import { inSlot, localTime } from "./Time.ts";

const ENRICH_PER_TICK = 3;
const SCORE_PER_TICK = 3;
const CARDS_PER_TICK = 4;

/** A failing step logs and yields its fallback; the rest of the tick still runs. */
const swallow =
  <B>(label: string, fallback: B) =>
  <A, E, R>(eff: Effect.Effect<A, E, R>): Effect.Effect<A | B, never, R> =>
    eff.pipe(
      Effect.catchCause((cause) => Effect.logWarning(`${label} failed`, { cause: String(cause) }).pipe(Effect.as(fallback as A | B))),
    );

export const runTick = Effect.fn("Tick.run")(function* (scheduledTime: number, options: { force?: boolean } = {}) {
  const kv = yield* Kv;
  const repo = yield* Repo;
  const routine = yield* Routine;
  const settings = yield* Settings;

  const slot = Math.floor(scheduledTime / 300_000);
  const lockKey = `lock:tick:${slot}`;
  if (!options.force && (yield* kv.get(lockKey))) {
    yield* Effect.logInfo("tick already handled", { slot });
    return;
  }
  yield* kv.put(lockKey, "1", 600);

  const runId = yield* repo.startRun("tick");
  const local = localTime(new Date(scheduledTime));
  const stats: Record<string, unknown> = { slot, local: `${local.date} ${local.hour}:${local.minute}` };

  // 1. One RSS keyword per tick, rotating; four keywords → each every twenty minutes.
  const cursor = Number((yield* kv.get("rss:cursor")) ?? 0);
  const keyword = djinniConfig.keywords[cursor % djinniConfig.keywords.length]!;
  stats.rss = yield* ingestDjinniKeyword(keyword).pipe(swallow("rss", { keyword, error: true }));
  yield* kv.put("rss:cursor", String((cursor + 1) % djinniConfig.keywords.length));

  // 1b. Hacker News "Who is hiring": one page per hour, on the top-of-hour tick.
  if (local.minute < 5) stats.hn = yield* ingestHackerNews().pipe(swallow("hn", { error: true }));

  // 1c. The Effect job directory, once a day at 09:00 local.
  if (local.hour === 9 && local.minute < 5) stats.effect = yield* ingestEffectJobs().pipe(swallow("effect", { error: true }));

  // 2. Enrich, 3. score, 4. card.
  stats.enriched = yield* enrichDjinni(ENRICH_PER_TICK).pipe(swallow("enrich", 0));
  stats.scored = yield* scoreEnriched(SCORE_PER_TICK).pipe(swallow("score", 0));
  stats.carded = yield* cardScored(CARDS_PER_TICK).pipe(swallow("card", 0));
  stats.draftCards = yield* cardPendingDrafts(CARDS_PER_TICK).pipe(swallow("draft-cards", 0));

  // 5. Ask the routine to draft when something hot is waiting or a reply was requested.
  const waiting = yield* repo.queueJobs(5).pipe(swallow("queue", []));
  const replies = yield* repo.queueReplies(1).pipe(swallow("replies", []));
  const hot = waiting.some((w) => w.job.hot === 1);
  if (hot || replies.length > 0) stats.fired = (yield* routine.fire(hot ? "hot job waiting" : "reply requested")).fired;

  // 6. Summaries and housekeeping, once per slot per day.
  if (inSlot(local, settings.summaryLocalTime)) {
    const key = `lock:summary:${local.date}`;
    if (!(yield* kv.get(key))) {
      yield* kv.put(key, "1", 36 * 3600);
      yield* dailySummary().pipe(swallow("summary", undefined));
      stats.housekeeping = yield* housekeeping().pipe(swallow("housekeeping", { expired: 0, silent: 0 }));
    }
  }
  if (local.weekday === 0 && inSlot(local, settings.weeklyLocalTime)) {
    const key = `lock:weekly:${local.isoWeek}`;
    if (!(yield* kv.get(key))) {
      yield* kv.put(key, "1", 8 * 86400);
      yield* weeklySummary().pipe(swallow("weekly", undefined));
    }
  }

  yield* repo.finishRun(runId, true, stats);
  yield* Effect.logInfo("tick done", { ...stats, at: now() });
});
