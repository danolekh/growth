/**
 * Asking the cloud routine to run now. Budgeted in KV so a burst of hot jobs cannot burn the
 * account's daily routine allowance: at most `maxFiresPerDay`, at least `minFireGapMinutes`
 * apart. The scheduled runs (three a day) are not counted here.
 */
import { Effect, Option, Redacted } from "effect";
import { HttpClientRequest, HttpClientResponse } from "effect/unstable/http";

import type { Deps } from "./Deps.ts";
import { localTime } from "./Time.ts";

export const fireRoutine = (deps: Deps, reason: string) =>
  Effect.gen(function* () {
    const { settings, kv, http, repo } = deps;
    if (Option.isNone(settings.fireUrl) || Option.isNone(settings.fireToken)) {
      yield* Effect.logInfo("fire skipped: routine fire endpoint not configured", { reason });
      return false;
    }
    const local = localTime();
    const countKey = `fire:count:${local.date}`;
    const used = Number((yield* kv.get(countKey)) ?? 0);
    if (used >= settings.maxFiresPerDay) {
      yield* Effect.logInfo("fire skipped: daily budget used", { used, reason });
      return false;
    }
    const last = yield* kv.get("fire:last");
    if (last && Date.now() - new Date(last).getTime() < settings.minFireGapMinutes * 60_000) {
      yield* Effect.logInfo("fire skipped: too soon after the last one", { last, reason });
      return false;
    }
    const url = settings.fireUrl.value;
    const token = Redacted.value(settings.fireToken.value);
    yield* HttpClientRequest.post(url).pipe(
      HttpClientRequest.setHeaders({ authorization: `Bearer ${token}`, "content-type": "application/json" }),
      HttpClientRequest.bodyJsonUnsafe({ reason }),
      http.execute,
      Effect.flatMap(HttpClientResponse.filterStatusOk),
      Effect.timeout("15 seconds"),
    );
    yield* kv.put(countKey, String(used + 1), 36 * 3600);
    yield* kv.put("fire:last", new Date().toISOString());
    yield* repo.insertEvent({ kind: "fire", payload: JSON.stringify({ reason }), at: new Date().toISOString() });
    yield* Effect.logInfo("routine fired", { reason });
    return true;
  }).pipe(
    Effect.catch((err) => Effect.logWarning("fire failed", { err: String(err) }).pipe(Effect.as(false))),
  );
