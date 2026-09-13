/**
 * Runtime configuration. Every value is read through `Config`, so at deploy time Alchemy binds
 * each key from `.env` to the Worker (redacted ones as secrets) and at runtime the same code
 * reads them back from the environment. Secrets stay `Redacted` until the one place that needs
 * the raw string.
 */
import { Config, Context, Effect, Layer, Option, type Redacted } from "effect";

export interface TelegramCredentials {
  readonly botToken: Redacted.Redacted<string>;
  /** Empty until Dan sends /start and the id lands in TELEGRAM_CHAT_ID. */
  readonly chatId: string;
}

export class Settings extends Context.Service<
  Settings,
  {
    readonly telegram: Option.Option<TelegramCredentials>;
    readonly webhookSecret: Option.Option<Redacted.Redacted<string>>;
    readonly routineToken: Option.Option<Redacted.Redacted<string>>;
    readonly adminToken: Option.Option<Redacted.Redacted<string>>;
    readonly fireUrl: Option.Option<string>;
    readonly fireToken: Option.Option<Redacted.Redacted<string>>;
    readonly openRouterKey: Option.Option<Redacted.Redacted<string>>;
    readonly summaryLocalTime: string;
    readonly weeklyLocalTime: string;
    readonly inboundAllow: ReadonlyArray<string>;
    /** Verified Email Routing destination that gets a copy of direct mail to jobs@ (not of Gmail-forwarded alerts). */
    readonly mailArchiveTo: Option.Option<string>;
    readonly maxFiresPerDay: number;
    readonly minFireGapMinutes: number;
    /** Total (out of 20) at or above which a job is an apply / apply-low; tune from the summary data. */
    readonly scoreApplyMin: number;
    readonly scoreLowMin: number;
  }
>()("growth/Settings") {
  static readonly layer = Layer.effect(Settings)(
    Effect.gen(function* () {
      const botToken = yield* Config.option(Config.redacted("TELEGRAM_BOT_TOKEN"));
      const chatId = yield* Config.string("TELEGRAM_CHAT_ID").pipe(Config.withDefault(""));
      // Empty by default: recruiters write from any domain, and unknown mail is only previewed.
      // Set it to a comma-separated list of sender domains to hard-drop everything else.
      const allow = yield* Config.string("INBOUND_ALLOW").pipe(Config.withDefault(""));
      return {
        telegram: Option.map(botToken, (token) => ({ botToken: token, chatId: chatId.trim() })),
        webhookSecret: yield* Config.option(Config.redacted("TELEGRAM_WEBHOOK_SECRET")),
        routineToken: yield* Config.option(Config.redacted("ROUTINE_TOKEN")),
        adminToken: yield* Config.option(Config.redacted("ADMIN_TOKEN")),
        fireUrl: yield* Config.option(Config.nonEmptyString("ROUTINE_FIRE_URL")),
        fireToken: yield* Config.option(Config.redacted("ROUTINE_FIRE_TOKEN")),
        openRouterKey: yield* Config.option(Config.redacted("OPENROUTER_API_KEY")),
        summaryLocalTime: yield* Config.string("SUMMARY_LOCAL_TIME").pipe(Config.withDefault("08:30")),
        weeklyLocalTime: yield* Config.string("WEEKLY_LOCAL_TIME").pipe(Config.withDefault("19:00")),
        inboundAllow: allow.split(",").map((s) => s.trim()).filter(Boolean),
        mailArchiveTo: yield* Config.option(Config.nonEmptyString("MAIL_ARCHIVE_TO")),
        maxFiresPerDay: yield* Config.number("MAX_FIRES_PER_DAY").pipe(Config.withDefault(6)),
        minFireGapMinutes: yield* Config.number("MIN_FIRE_GAP_MINUTES").pipe(Config.withDefault(60)),
        scoreApplyMin: yield* Config.number("SCORE_APPLY_MIN").pipe(Config.withDefault(15)),
        scoreLowMin: yield* Config.number("SCORE_LOW_MIN").pipe(Config.withDefault(12)),
      };
    }),
  );
}
