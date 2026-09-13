/**
 * The failures this Worker can produce, as tagged schema errors so they carry a `_tag` for
 * `Effect.catchTag`, serialize cleanly into logs, and never leak a secret through `toString`.
 */
import { Schema } from "effect";

export class DjinniFetchError extends Schema.TaggedErrorClass<DjinniFetchError>()("DjinniFetchError", {
  url: Schema.String,
  cause: Schema.Defect(),
}) {}

export class TelegramError extends Schema.TaggedErrorClass<TelegramError>()("TelegramError", {
  method: Schema.String,
  cause: Schema.Defect(),
}) {}

export class ScoreError extends Schema.TaggedErrorClass<ScoreError>()("ScoreError", {
  model: Schema.String,
  cause: Schema.Defect(),
}) {}

export class MailParseError extends Schema.TaggedErrorClass<MailParseError>()("MailParseError", {
  cause: Schema.Defect(),
}) {}

export class RoutineFireError extends Schema.TaggedErrorClass<RoutineFireError>()("RoutineFireError", {
  cause: Schema.Defect(),
}) {}

export class BadRequest extends Schema.TaggedErrorClass<BadRequest>()("BadRequest", {
  message: Schema.String,
}) {}
