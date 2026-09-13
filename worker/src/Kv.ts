/**
 * KV as the small set of operations the hunt needs: string get/put with a TTL, and delete.
 * Locks, cursors, budgets and Telegram file ids live here.
 */
import type { RuntimeContext } from "alchemy/RuntimeContext";
import { Context, Effect, Layer } from "effect";

import { KvClient } from "./Bindings.ts";

export class Kv extends Context.Service<
  Kv,
  {
    readonly get: (key: string) => Effect.Effect<string | null, never, RuntimeContext>;
    readonly put: (key: string, value: string, ttlSeconds?: number) => Effect.Effect<void, never, RuntimeContext>;
    readonly delete: (key: string) => Effect.Effect<void, never, RuntimeContext>;
  }
>()("growth/Kv") {
  static readonly layer = Layer.effect(Kv)(
    Effect.gen(function* () {
      const client = yield* KvClient;
      return {
        get: (key) => client.get(key).pipe(Effect.orDie),
        put: (key, value, ttl) =>
          client.put(key, value, ttl ? { expirationTtl: Math.max(60, ttl) } : undefined).pipe(Effect.orDie),
        delete: (key) => client.delete(key).pipe(Effect.orDie),
      };
    }),
  );
}
