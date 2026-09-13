/**
 * The Telegram bot client. Lifted from the sportmagaz storefront Worker: HTML parse mode, a
 * 10-second timeout, two exponential retries, and a logged no-op when no token is configured so
 * the rest of the system never branches on "is Telegram set up".
 *
 * Built once in the Worker's init phase from a plain HttpClient, so handlers close over it and
 * need no extra service in their context.
 */
import { Effect, Option, Redacted, Schedule } from "effect";
import { HttpClient, HttpClientRequest, HttpClientResponse } from "effect/unstable/http";

export class TelegramError extends Error {
  readonly _tag = "TelegramError";
  constructor(readonly method: string, readonly cause: unknown) {
    super(`telegram ${method} failed`);
  }
}

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

export interface TelegramClient {
  readonly configured: boolean;
  readonly chatId: string;
  /** Returns the sent message id, or -1 when unconfigured. */
  readonly send: (html: string, options?: SendOptions) => Effect.Effect<number, TelegramError>;
  readonly sendDocument: (fileId: string, caption?: string) => Effect.Effect<void, TelegramError>;
  readonly edit: (messageId: number, html: string, options?: SendOptions) => Effect.Effect<void, TelegramError>;
  readonly answerCallback: (callbackId: string, text?: string) => Effect.Effect<void, TelegramError>;
  readonly call: (method: string, body: Record<string, unknown>) => Effect.Effect<unknown, TelegramError>;
}

export interface TelegramCredentials {
  readonly botToken: Redacted.Redacted<string>;
  readonly chatId: string;
}

const RETRY_TIMES = 2;
const retrySchedule = Schedule.exponential("200 millis");

export const escapeHtml = (s: string): string =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const makeTelegram = (
  client: HttpClient.HttpClient,
  credentials: Option.Option<TelegramCredentials>,
): TelegramClient => {
  if (Option.isNone(credentials)) {
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

  const { botToken, chatId } = credentials.value;
  const base = `https://api.telegram.org/bot${Redacted.value(botToken)}`;

  const call = (method: string, body: Record<string, unknown>) =>
    HttpClientRequest.post(`${base}/${method}`).pipe(
      HttpClientRequest.bodyJsonUnsafe(body),
      client.execute,
      Effect.flatMap(HttpClientResponse.filterStatusOk),
      Effect.flatMap((res) => res.json),
      Effect.timeout("10 seconds"),
      Effect.retry({ schedule: retrySchedule, times: RETRY_TIMES }),
      Effect.mapError((cause) => new TelegramError(method, cause)),
    );

  const markup = (options?: SendOptions) =>
    options?.keyboard ? { reply_markup: { inline_keyboard: options.keyboard } } : {};

  return {
    configured: true,
    chatId,
    send: (html, options) =>
      call("sendMessage", {
        chat_id: chatId,
        text: html,
        parse_mode: "HTML",
        disable_web_page_preview: options?.disablePreview ?? true,
        disable_notification: options?.silent ?? false,
        ...markup(options),
      }).pipe(Effect.map((r) => Number((r as any)?.result?.message_id ?? -1))),
    sendDocument: (fileId, caption) =>
      call("sendDocument", {
        chat_id: chatId,
        document: fileId,
        ...(caption ? { caption, parse_mode: "HTML" } : {}),
      }).pipe(Effect.asVoid),
    edit: (messageId, html, options) =>
      call("editMessageText", {
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
};
