/**
 * Everything the handlers close over, built once in the Worker's init phase.
 */
import type { Effect, Option, Redacted } from "effect";
import type { HttpClient } from "effect/unstable/http";

import type { Repo } from "./Db.ts";
import type { AiRunner } from "./Score.ts";
import type { TelegramClient } from "./Telegram.ts";

export interface Kv {
  readonly get: (key: string) => Effect.Effect<string | null, unknown, any>;
  readonly put: (key: string, value: string, ttlSeconds?: number) => Effect.Effect<void, unknown, any>;
  readonly delete: (key: string) => Effect.Effect<void, unknown, any>;
}

export interface Settings {
  readonly routineToken: Option.Option<Redacted.Redacted<string>>;
  readonly adminToken: Option.Option<Redacted.Redacted<string>>;
  readonly webhookSecret: Option.Option<Redacted.Redacted<string>>;
  readonly fireUrl: Option.Option<string>;
  readonly fireToken: Option.Option<Redacted.Redacted<string>>;
  readonly openRouterKey: Option.Option<Redacted.Redacted<string>>;
  readonly summaryLocalTime: string;
  readonly weeklyLocalTime: string;
  readonly inboundAllow: string[];
  readonly maxFiresPerDay: number;
  readonly minFireGapMinutes: number;
}

export interface Deps {
  readonly repo: Repo;
  readonly kv: Kv;
  readonly ai: AiRunner;
  readonly http: HttpClient.HttpClient;
  readonly telegram: TelegramClient;
  readonly settings: Settings;
  readonly waitUntil: <A, E>(effect: Effect.Effect<A, E, any>) => Effect.Effect<void, never, any>;
}
