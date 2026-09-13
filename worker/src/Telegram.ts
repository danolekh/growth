/**
 * The Telegram bot client as a service. Lifted from the sportmagaz storefront Worker: HTML parse
 * mode, a 10-second timeout, two exponential retries, and a logged no-op when no token is
 * configured so callers never branch on "is Telegram set up". With a token but no chat id yet
 * (before /start), `call` still works so the bot can answer /start with the id.
 */
import { Context, Effect, Layer, Option, Redacted, Schedule } from "effect";
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http";

import { TelegramError } from "./Errors.ts";
import { Settings } from "./Settings.ts";

export interface InlineButton {
  readonly text: string;
  readonly callback_data?: string;
  readonly url?: string;
}

export interface SendOptions {
  readonly keyboard?: InlineButton[][];
  readonly disablePreview?: boolean;
  readonly silent?: boolean;
}

export class Telegram extends Context.Service<
  Telegram,
  {
    readonly configured: boolean;
    readonly chatId: string;
    /** Resolves to the sent message id, or -1 when nothing could be sent. */
    readonly send: (html: string, options?: SendOptions) => Effect.Effect<number, TelegramError>;
    readonly sendDocument: (fileId: string, caption?: string) => Effect.Effect<void, TelegramError>;
    readonly edit: (messageId: number, html: string, options?: SendOptions) => Effect.Effect<void, TelegramError>;
    readonly answerCallback: (callbackId: string, text?: string) => Effect.Effect<void, TelegramError>;
    readonly call: (method: string, body: Record<string, unknown>) => Effect.Effect<unknown, TelegramError>;
  }
>()("growth/Telegram") {
  static readonly layer = Layer.effect(Telegram)(
    Effect.gen(function* () {
      const settings = yield* Settings;
      const client = yield* HttpClient.HttpClient;

      if (Option.isNone(settings.telegram)) {
        const noop = <A>(value: A) => Effect.logDebug("telegram not configured, skipping").pipe(Effect.as(value));
        return {
          configured: false,
          chatId: "",
          send: () => noop(-1),
          sendDocument: () => noop(undefined),
          edit: () => noop(undefined),
          answerCallback: () => noop(undefined),
          call: () => noop(undefined),
        };
      }

      const { botToken, chatId } = settings.telegram.value;
      const base = `https://api.telegram.org/bot${Redacted.value(botToken)}`;
      const needChat = <A>(value: A) =>
        Effect.logWarning("telegram chat id not set; skipping (send /start to the bot)").pipe(Effect.as(value));

      const call = Effect.fn("Telegram.call")(function* (method: string, body: Record<string, unknown>) {
        return yield* HttpClientRequest.post(`${base}/${method}`).pipe(
          HttpClientRequest.bodyJsonUnsafe(body),
          client.execute,
          Effect.flatMap(HttpClientResponse.filterStatusOk),
          Effect.flatMap((res) => res.json),
          Effect.timeout("10 seconds"),
          Effect.retry({ schedule: Schedule.exponential("200 millis"), times: 2 }),
          Effect.mapError((cause) => TelegramError.make({ method, cause })),
        );
      });

      const markup = (options?: SendOptions) =>
        options?.keyboard ? { reply_markup: { inline_keyboard: options.keyboard } } : {};

      return {
        configured: true,
        chatId,
        send: (html, options) =>
          !chatId
            ? needChat(-1)
            : call("sendMessage", {
                chat_id: chatId,
                text: html,
                parse_mode: "HTML",
                disable_web_page_preview: options?.disablePreview ?? true,
                disable_notification: options?.silent ?? false,
                ...markup(options),
              }).pipe(Effect.map((r) => Number((r as any)?.result?.message_id ?? -1))),
        sendDocument: (fileId, caption) =>
          !chatId
            ? needChat(undefined)
            : call("sendDocument", {
                chat_id: chatId,
                document: fileId,
                ...(caption ? { caption, parse_mode: "HTML" } : {}),
              }).pipe(Effect.asVoid),
        edit: (messageId, html, options) =>
          !chatId
            ? needChat(undefined)
            : call("editMessageText", {
                chat_id: chatId,
                message_id: messageId,
                text: html,
                parse_mode: "HTML",
                disable_web_page_preview: true,
                ...markup(options),
              }).pipe(Effect.asVoid),
        answerCallback: (callbackId, text) =>
          call("answerCallbackQuery", { callback_query_id: callbackId, ...(text ? { text } : {}) }).pipe(Effect.asVoid),
        call,
      };
    }),
  );
}

export const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
