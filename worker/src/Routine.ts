/**
 * Asking the cloud routine to run now. Budgeted in KV so a burst of hot jobs cannot burn the
 * account's daily routine allowance: at most `maxFiresPerDay`, at least `minFireGapMinutes`
 * apart. The scheduled runs are not counted here.
 */
import type { RuntimeContext } from "alchemy/RuntimeContext";
import { Context, Effect, Layer, Option, Redacted } from "effect";
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http";

import { Kv } from "./Kv.ts";
import { Repo } from "./Repo.ts";
import { Settings } from "./Settings.ts";
import { localTime } from "./Time.ts";

export class Routine extends Context.Service<
  Routine,
  {
    /** True when a fire was actually sent. Never fails: a fire is best effort. */
    readonly fire: (reason: string) => Effect.Effect<boolean, never, RuntimeContext>;
  }
>()("growth/Routine") {
  static readonly layer = Layer.effect(Routine)(
    Effect.gen(function* () {
      const settings = yield* Settings;
      const kv = yield* Kv;
      const repo = yield* Repo;
      const client = yield* HttpClient.HttpClient;

      const fire = Effect.fn("Routine.fire")(
        function* (reason: string) {
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
          // The /fire endpoint is a research-preview beta; both headers are required.
          yield* HttpClientRequest.post(settings.fireUrl.value).pipe(
            HttpClientRequest.bearerToken(Redacted.value(settings.fireToken.value)),
            HttpClientRequest.setHeaders({ "anthropic-beta": "experimental-cc-routine-2026-04-01", "anthropic-version": "2023-06-01" }),
            HttpClientRequest.bodyJsonUnsafe({ text: `growth fired the routine: ${reason}` }),
            client.execute,
            Effect.flatMap(HttpClientResponse.filterStatusOk),
            Effect.timeout("15 seconds"),
          );
          yield* kv.put(countKey, String(used + 1), 36 * 3600);
          yield* kv.put("fire:last", new Date().toISOString());
          yield* repo.insertEvent({ kind: "fire", payload: JSON.stringify({ reason }), at: new Date().toISOString() });
          yield* Effect.logInfo("routine fired", { reason });
          return true;
        },
        Effect.catch((err) => Effect.logWarning("fire failed", { err: String(err) }).pipe(Effect.as(false))),
      );

      return { fire };
    }),
  );
}
