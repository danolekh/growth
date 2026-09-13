/**
 * The Cloudflare bindings Alchemy hands the Worker in its init phase, wrapped as services so the
 * rest of the code depends on `KvClient`, `Drizzle`, `WorkersAi` and `Background` rather than on
 * values threaded through arguments. Growth.ts builds these with `Layer.succeed`.
 */
import type * as Cloudflare from "alchemy/Cloudflare";
import type { EffectSQLiteD1Database } from "drizzle-orm/effect-d1";
import type { RuntimeContext } from "alchemy/RuntimeContext";
import { Context, type Effect } from "effect";

export class KvClient extends Context.Service<KvClient, Cloudflare.KV.ReadWriteNamespaceClient>()("growth/KvClient") {}

export class Drizzle extends Context.Service<Drizzle, EffectSQLiteD1Database>()("growth/Drizzle") {}

export class WorkersAi extends Context.Service<WorkersAi, Cloudflare.Workers.AIClient>()("growth/WorkersAi") {}

/** `ctx.waitUntil` as a service: run an effect after the response without blocking it. */
export class Background extends Context.Service<
  Background,
  {
    readonly run: <A, E>(effect: Effect.Effect<A, E, RuntimeContext>) => Effect.Effect<void, never, RuntimeContext>;
  }
>()("growth/Background") {}
