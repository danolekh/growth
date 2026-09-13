/**
 * growth — the always-on half of Dan's job hunt, as one Alchemy Worker (yielded by alchemy.run.ts).
 *
 * Infrastructure and runtime live together on purpose (Infrastructure as Effects): the init
 * phase below declares the D1 database, the KV namespace, the Workers AI binding, the email
 * route and the cron, turns the bindings into services, builds the application layer once per
 * isolate, and returns handlers that run inside that context.
 */
import * as Cloudflare from "alchemy/Cloudflare";
import * as Drizzle from "alchemy/Drizzle/D1";
import { Context, Effect, Layer, Option } from "effect";
import { FetchHttpClient } from "effect/unstable/http";

import { handleRequest } from "./Api.ts";
import { Background, Drizzle as DrizzleDb, KvClient, WorkersAi } from "./Bindings.ts";
import { ingestMail, parseMail } from "./EmailIngest.ts";
import { onEmail } from "./EmailSource.ts";
import { Kv } from "./Kv.ts";
import { Repo } from "./Repo.ts";
import { Routine } from "./Routine.ts";
import { Scorer } from "./Scorer.ts";
import { Settings } from "./Settings.ts";
import { Telegram } from "./Telegram.ts";
import { runTick } from "./Tick.ts";

const ZONE = "danolekh.com";
const INBOX = `jobs@${ZONE}`;
const WORKER_NAME = "growth";
/** Where a copy of direct mail to jobs@ goes, so Dan has a real inbox for it. Must be verified once. */
const ARCHIVE_ADDRESS = "danyaolekhq@gmail.com";

export default Cloudflare.Worker(
  WORKER_NAME,
  {
    name: WORKER_NAME,
    main: import.meta.url,
    compatibility: { date: "2026-09-01", flags: ["nodejs_compat"] },
    workersDev: true,
    observability: { enabled: true, head_sampling_rate: 1 } as any,
  },
  Effect.gen(function* () {
    // ---- resources ----
    const database = yield* Cloudflare.D1.Database("growth-db", {
      migrationsDir: "./migrations",
      migrationsTable: "drizzle_migrations",
    });
    const namespace = yield* Cloudflare.KV.Namespace("growth-kv");
    yield* Cloudflare.Email.Routing("jobs-routing", { zone: ZONE });
    yield* Cloudflare.Email.Address("jobs-archive", { email: ARCHIVE_ADDRESS });
    yield* Cloudflare.Email.Rule("jobs-rule", {
      zone: ZONE,
      name: `${INBOX} → ${WORKER_NAME}`,
      matchers: [{ type: "literal", field: "to", value: INBOX }],
      actions: [{ type: "worker", value: [WORKER_NAME] }],
    });

    // ---- bindings → services ----
    const d1 = yield* Cloudflare.D1.QueryDatabase(database);
    const db = yield* Drizzle.D1(d1);
    const kvClient = yield* Cloudflare.KV.ReadWriteNamespace(namespace);
    const ai = yield* Cloudflare.Workers.AI();
    const exec = yield* Cloudflare.Workers.WorkerExecutionContext;

    const BindingsLayer = Layer.mergeAll(
      Layer.succeed(DrizzleDb, db as any),
      Layer.succeed(KvClient, kvClient),
      Layer.succeed(WorkersAi, ai),
      Layer.succeed(Background, { run: (effect) => exec.waitUntil(effect) }),
    );

    // ---- the application layer, built once per isolate ----
    // Handlers also reach for the bindings and the HttpClient directly, so both stay in the
    // context (provideMerge), while the layers below them are only wired, not re-exported.
    const AppLayer = Layer.mergeAll(Settings.layer, Kv.layer, Repo.layer, Telegram.layer, Scorer.layer, Routine.layer).pipe(
      Layer.provideMerge(Layer.mergeAll(Settings.layer, Kv.layer, Repo.layer)),
      Layer.provideMerge(BindingsLayer),
      Layer.provideMerge(FetchHttpClient.layer),
    );
    const services = yield* Layer.build(AppLayer).pipe(Effect.scoped);
    const settings = Context.get(services, Settings);

    // ---- cron: the five-minute tick ----
    yield* Cloudflare.Workers.cron("*/5 * * * *", (controller) =>
      runTick(controller.scheduledTime).pipe(
        Effect.catchCause((cause) => Effect.logError("tick failed", { cause: String(cause) })),
        Effect.provideContext(services),
      ),
    );

    // ---- email: the jobs@ inbox ----
    yield* onEmail((message) => {
      const allowed = settings.inboundAllow.length === 0 || settings.inboundAllow.some((d) => message.from.toLowerCase().endsWith(d));
      if (!allowed) return Effect.logInfo("mail dropped: sender not allowed", { from: message.from });
      // Mail that did not come through Gmail's forwarding (recruiters writing to jobs@ directly)
      // is copied to the archive address so it has a human-readable inbox. Forwarded alerts are
      // already in Gmail; copying them back would loop through the forwarding filter.
      const viaGmail = /gmail\.com|googlemail\.com/i.test(message.from);
      const archiveTo = Option.getOrUndefined(settings.mailArchiveTo);
      const archive = archiveTo && !viaGmail
        ? Effect.tryPromise(() => message.forward(archiveTo)).pipe(
            Effect.catch((err) => Effect.logWarning("archive forward failed (destination verified?)", { err: String(err) })),
          )
        : Effect.void;
      return archive.pipe(
        Effect.andThen(parseMail(message.raw as any)),
        Effect.flatMap((mail) => ingestMail(mail)),
        Effect.catchCause((cause) => Effect.logError("email failed", { cause: String(cause) })),
        Effect.provideContext(services),
      );
    });

    // ---- http ----
    return {
      fetch: Effect.gen(function* () {
        const request = yield* Cloudflare.Workers.Request;
        return yield* handleRequest(request as unknown as Request).pipe(Effect.provideContext(services));
      }),
    };
  }).pipe(
    Effect.provide([
      Cloudflare.D1.QueryDatabaseBinding,
      Cloudflare.KV.ReadWriteNamespaceBinding,
      Cloudflare.Workers.AIBinding,
      Cloudflare.Workers.CronEventSourceLive,
    ]),
  ),
);
