/**
 * The five-minute tick. One cron trigger, one bounded chunk of work per fire, dispatched by
 * Vienna wall clock: one RSS keyword, a few page fetches, a few scores, a few cards, maybe a
 * routine fire, and the daily or weekly summary when its slot comes around.
 *
 * Cloudflare delivers crons at least once, so every tick takes a KV lock keyed by its
 * five-minute slot and a summary takes a lock keyed by its date.
 */
import { Effect } from "effect";

import { now } from "./Db.ts";
import type { Deps } from "./Deps.ts";
import { djinniConfig } from "./Djinni.ts";
import { fireRoutine } from "./Fire.ts";
import { cardScored, enrichDjinni, ingestDjinniKeyword, scoreEnriched } from "./Ingest.ts";
import { dailySummary, housekeeping, weeklySummary } from "./Summary.ts";
import { inSlot, localTime } from "./Time.ts";

const ENRICH_PER_TICK = 3;
const SCORE_PER_TICK = 3;
const CARDS_PER_TICK = 4;

const swallow =
  <B>(label: string, fallback: B) =>
  <A, E, R>(eff: Effect.Effect<A, E, R>): Effect.Effect<A | B, never, R> =>
    eff.pipe(Effect.catchCause((cause) => Effect.logWarning(`${label} failed`, { cause: String(cause) }).pipe(Effect.as(fallback as A | B))));

export const runTick = (deps: Deps, scheduledTime: number) =>
  Effect.gen(function* () {
    const slot = Math.floor(scheduledTime / 300_000);
    const lockKey = `lock:tick:${slot}`;
    if (yield* deps.kv.get(lockKey)) {
      yield* Effect.logInfo("tick already handled", { slot });
      return;
    }
    yield* deps.kv.put(lockKey, "1", 600);

    const runId = yield* deps.repo.startRun("tick");
    const local = localTime(new Date(scheduledTime));
    const stats: Record<string, unknown> = { slot, local: `${local.date} ${local.hour}:${local.minute}` };

    // 1. One RSS keyword per tick, rotating; six keywords → each every 30 minutes.
    const cursor = Number((yield* deps.kv.get("rss:cursor")) ?? 0);
    const keyword = djinniConfig.keywords[cursor % djinniConfig.keywords.length]!;
    stats.rss = yield* ingestDjinniKeyword(deps, keyword).pipe(swallow("rss", { keyword, error: true }));
    yield* deps.kv.put("rss:cursor", String((cursor + 1) % djinniConfig.keywords.length));

    // 2. Enrich, 3. score, 4. card.
    stats.enriched = yield* enrichDjinni(deps, ENRICH_PER_TICK).pipe(swallow("enrich", 0));
    stats.scored = yield* scoreEnriched(deps, SCORE_PER_TICK).pipe(swallow("score", 0));
    stats.carded = yield* cardScored(deps, CARDS_PER_TICK).pipe(swallow("card", 0));

    // 5. Ask the routine to draft when something hot is waiting or a reply was requested.
    const waiting = yield* deps.repo.queueJobs(5).pipe(swallow("queue", []));
    const replies = yield* deps.repo.queueReplies(1).pipe(swallow("replies", []));
    if (waiting.some((w) => w.job.hot === 1) || replies.length > 0) {
      stats.fired = yield* fireRoutine(deps, waiting.some((w) => w.job.hot === 1) ? "hot job waiting" : "reply requested");
    }

    // 6. Summaries and housekeeping, once per slot per day.
    if (inSlot(local, deps.settings.summaryLocalTime)) {
      const key = `lock:summary:${local.date}`;
      if (!(yield* deps.kv.get(key))) {
        yield* deps.kv.put(key, "1", 36 * 3600);
        yield* dailySummary(deps).pipe(swallow("summary", undefined));
        stats.housekeeping = yield* housekeeping(deps).pipe(swallow("housekeeping", { expired: 0, silent: 0 }));
      }
    }
    if (local.weekday === 0 && inSlot(local, deps.settings.weeklyLocalTime)) {
      const key = `lock:weekly:${local.isoWeek}`;
      if (!(yield* deps.kv.get(key))) {
        yield* deps.kv.put(key, "1", 8 * 86400);
        yield* weeklySummary(deps).pipe(swallow("weekly", undefined));
      }
    }

    yield* deps.repo.finishRun(runId, true, stats);
    yield* Effect.logInfo("tick done", { ...stats, at: now() });
  });
