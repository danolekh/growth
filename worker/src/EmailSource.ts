/**
 * Subscribe to the Worker's `email` events with an Effect handler, the way Alchemy's own
 * `Cloudflare.Workers.cron` subscribes to cron fires: register a listener on the runtime
 * context during init, and run the handler per delivered message.
 *
 * Alchemy generates an `email` export for every Worker; without a listener the dispatcher dies
 * with "No event handler found", so this must be registered whenever the zone routes mail here.
 * `RuntimeContext` is provided by Alchemy per event, which is why it is excluded from the
 * returned requirements (same cast Alchemy uses in CronEventSource).
 */
import * as Cloudflare from "alchemy/Cloudflare";
import { RuntimeContext } from "alchemy/RuntimeContext";
import type { FunctionContext } from "alchemy/Serverless/Function";
import { Effect } from "effect";

export const onEmail = <Req = never>(
  process: (message: ForwardableEmailMessage) => Effect.Effect<void, unknown, Req>,
): Effect.Effect<void, never, Exclude<Req, RuntimeContext>> =>
  Effect.gen(function* () {
    const ctx = (yield* RuntimeContext) as unknown as FunctionContext;
    yield* ctx.listen<void, Req>((event: unknown) => {
      if (!Cloudflare.Workers.isWorkerEvent(event) || event.type !== "email") return;
      return process(event.input as ForwardableEmailMessage).pipe(Effect.catchCause(() => Effect.void));
    });
  }) as unknown as Effect.Effect<void, never, Exclude<Req, RuntimeContext>>;
