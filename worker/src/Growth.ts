/**
 * growth — the always-on half of Dan's job hunt, as one Alchemy Worker (yielded by alchemy.run.ts).
 *
 * Infrastructure and runtime live in this file on purpose (Infrastructure as Effects): the
 * construction phase below declares the D1 database, the KV namespace, the Workers AI binding,
 * the secrets, the cron and the email route, and the handlers it returns close over the typed
 * clients those declarations produce.
 */
import * as Cloudflare from "alchemy/Cloudflare";
import * as Drizzle from "alchemy/Drizzle/D1";
import { RuntimeContext } from "alchemy/RuntimeContext";
import type { FunctionContext } from "alchemy/Serverless/Function";
import { Config, Effect, Option } from "effect";
import { FetchHttpClient, HttpClient } from "effect/unstable/http";

import { handleRequest } from "./Api.ts";
import { makeRepo } from "./Db.ts";
import type { Deps, Kv, Settings } from "./Deps.ts";
import { ingestMail, parseMail } from "./EmailIngest.ts";
import { makeTelegram } from "./Telegram.ts";
import { runTick } from "./Tick.ts";

const ZONE = "danolekh.com";
const INBOX = `jobs@${ZONE}`;
const WORKER_NAME = "growth";

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

    // Inbound mail: enable routing on the zone and send jobs@ to this Worker.
    yield* Cloudflare.Email.Routing("jobs-routing", { zone: ZONE });
    yield* Cloudflare.Email.Rule("jobs-rule", {
      zone: ZONE,
      name: `${INBOX} → ${WORKER_NAME}`,
      matchers: [{ type: "literal", field: "to", value: INBOX }],
      actions: [{ type: "worker", value: [WORKER_NAME] }],
    });

    // ---- bindings ----
    const d1 = yield* Cloudflare.D1.QueryDatabase(database);
    const db = yield* Drizzle.D1(d1);
    const kvClient = yield* Cloudflare.KV.ReadWriteNamespace(namespace);
    const ai = yield* Cloudflare.Workers.AI();
    const exec = yield* Cloudflare.Workers.WorkerExecutionContext;
    const http = yield* HttpClient.HttpClient;

    // ---- configuration (read from .env at deploy time, bound as secrets/vars) ----
    const telegram = yield* Config.option(
      Config.all({
        botToken: Config.redacted("TELEGRAM_BOT_TOKEN"),
        chatId: Config.nonEmptyString("TELEGRAM_CHAT_ID"),
      }),
    );
    const settings: Settings = {
      routineToken: yield* Config.option(Config.redacted("ROUTINE_TOKEN")),
      adminToken: yield* Config.option(Config.redacted("ADMIN_TOKEN")),
      webhookSecret: yield* Config.option(Config.redacted("TELEGRAM_WEBHOOK_SECRET")),
      fireUrl: yield* Config.option(Config.nonEmptyString("ROUTINE_FIRE_URL")),
      fireToken: yield* Config.option(Config.redacted("ROUTINE_FIRE_TOKEN")),
      openRouterKey: yield* Config.option(Config.redacted("OPENROUTER_API_KEY")),
      summaryLocalTime: yield* Config.string("SUMMARY_LOCAL_TIME").pipe(Config.withDefault("08:30")),
      weeklyLocalTime: yield* Config.string("WEEKLY_LOCAL_TIME").pipe(Config.withDefault("19:00")),
      inboundAllow: (yield* Config.string("INBOUND_ALLOW").pipe(Config.withDefault("upwork.com,linkedin.com,djinni.co,gmail.com")))
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      maxFiresPerDay: yield* Config.number("MAX_FIRES_PER_DAY").pipe(Config.withDefault(6)),
      minFireGapMinutes: yield* Config.number("MIN_FIRE_GAP_MINUTES").pipe(Config.withDefault(60)),
    };

    const kv: Kv = {
      get: (key) => kvClient.get(key),
      put: (key, value, ttl) => kvClient.put(key, value, ttl ? { expirationTtl: Math.max(60, ttl) } : undefined),
      delete: (key) => kvClient.delete(key),
    };

    const deps: Deps = {
      repo: makeRepo(db as any),
      kv,
      ai: { run: (model, inputs) => ai.run(model as any, inputs as any) },
      http,
      telegram: makeTelegram(http, telegram),
      settings,
      waitUntil: (effect) => exec.waitUntil(effect as any),
    };

    // ---- cron: the five-minute tick ----
    yield* Cloudflare.Workers.cron("*/5 * * * *", (controller) =>
      runTick(deps, controller.scheduledTime).pipe(
        Effect.catchCause((cause) => Effect.logError("tick failed", { cause: String(cause) })),
      ),
    );

    // ---- email: the jobs@ inbox ----
    const ctx = (yield* RuntimeContext) as unknown as FunctionContext;
    const onEmail = (message: ForwardableEmailMessage) => {
      const allowed = settings.inboundAllow.length === 0 || settings.inboundAllow.some((d) => message.from.toLowerCase().endsWith(d));
      if (!allowed) return Effect.logInfo("mail dropped: sender not allowed", { from: message.from });
      return parseMail(message.raw as any).pipe(
        Effect.flatMap((mail) => ingestMail(deps, mail)),
        Effect.catchCause((cause) => Effect.logError("email failed", { cause: String(cause) })),
      );
    };
    yield* ctx.listen<void, never>((event: any) => {
      if (!Cloudflare.Workers.isWorkerEvent(event) || event.type !== "email") return;
      return onEmail(event.input as ForwardableEmailMessage) as Effect.Effect<void, never, never>;
    });

    // ---- http ----
    return {
      fetch: Effect.gen(function* () {
        const request = yield* Cloudflare.Workers.Request;
        return yield* handleRequest(deps, request as unknown as Request);
      }),
    };
  }).pipe(
    Effect.provide([
      Cloudflare.D1.QueryDatabaseBinding,
      Cloudflare.KV.ReadWriteNamespaceBinding,
      Cloudflare.Workers.AIBinding,
      Cloudflare.Workers.CronEventSourceLive,
      FetchHttpClient.layer,
    ]),
  ),
);
