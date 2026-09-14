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
import { localTime, nextCronLocal } from "./Time.ts";

export type FireResult =
  | { readonly fired: true }
  | { readonly fired: false; readonly reason: "unconfigured" | "budget" | "gap" | "failed" };

export class Routine extends Context.Service<
  Routine,
  {
    /** Never fails: a fire is best effort. The result says why it did not happen. */
    readonly fire: (reason: string) => Effect.Effect<FireResult, never, RuntimeContext>;
    /** One plain sentence for a card: when the draft will actually be written. */
    readonly explain: (result: FireResult, at?: Date) => string;
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
            return { fired: false, reason: "unconfigured" } as const;
          }
          const local = localTime();
          const countKey = `fire:count:${local.date}`;
          const used = Number((yield* kv.get(countKey)) ?? 0);
          if (used >= settings.maxFiresPerDay) {
            yield* Effect.logInfo("fire skipped: daily budget used", { used, reason });
            return { fired: false, reason: "budget" } as const;
          }
          const last = yield* kv.get("fire:last");
          if (last && Date.now() - new Date(last).getTime() < settings.minFireGapMinutes * 60_000) {
            yield* Effect.logInfo("fire skipped: too soon after the last one", { last, reason });
            return { fired: false, reason: "gap" } as const;
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
          return { fired: true } as const;
        },
        Effect.catch((err) =>
          Effect.logWarning("fire failed", { err: String(err) }).pipe(Effect.as({ fired: false, reason: "failed" } as const)),
        ),
      );

      const explain = (result: FireResult, at: Date = new Date()): string => {
        const next = nextCronLocal(settings.routineCronHoursUtc, at);
        const run = `the ${next.label} run${next.tomorrow ? " tomorrow" : ""}`;
        if (result.fired) return "⏳ Drafting now, about five minutes.";
        switch (result.reason) {
          case "gap":
            return `⏳ Next attempt within the hour, at the latest ${run}.`;
          case "budget":
            return `⏳ Today's ${settings.maxFiresPerDay} on-demand runs are used; drafted at ${run}.`;
          default:
            return `⏳ Drafted at ${run}.`;
        }
      };

      return { fire, explain };
    }),
  );
}
