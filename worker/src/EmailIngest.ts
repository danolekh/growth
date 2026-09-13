/**
 * The `email` handler body: parse the forwarded mail, classify it, and either create jobs
 * (alerts), record a conversation and ping Dan (messages), or preview it (unknown).
 */
import { Effect } from "effect";
import PostalMime from "postal-mime";

import { replyKeyboard } from "./Cards.ts";
import { classify, extractJobs, preview, type ParsedMail } from "./Email.ts";
import { MailParseError } from "./Errors.ts";
import { ingestExtracted } from "./Ingest.ts";
import { newId, now, Repo } from "./Repo.ts";
import { escapeHtml, Telegram } from "./Telegram.ts";

export const parseMail = (raw: ReadableStream<Uint8Array> | ArrayBuffer | string) =>
  Effect.tryPromise({
    try: async (): Promise<ParsedMail> => {
      const parsed = await PostalMime.parse(raw as any);
      return {
        from: parsed.from?.address ?? "",
        fromName: parsed.from?.name ?? "",
        subject: parsed.subject ?? "",
        text: parsed.text ?? "",
        html: parsed.html ?? "",
        messageId: parsed.messageId ?? `<${crypto.randomUUID()}@growth>`,
        receivedAt: now(),
      };
    },
    catch: (cause) => MailParseError.make({ cause }),
  });

/** Gmail forwards keep the original sender in the body; recover it when the envelope is Gmail. */
const originalSender = (mail: ParsedMail): string => {
  if (!/gmail\.com|googlemail\.com/i.test(mail.from)) return mail.from;
  const body = mail.text || mail.html;
  const m = body.match(/From:\s*[^<\n]*<([^>\s]+@[^>\s]+)>/i) || body.match(/From:\s*([^\s<>]+@[^\s<>]+)/i);
  return m ? m[1]! : mail.from;
};

export const ingestMail = Effect.fn("EmailIngest.ingest")(function* (mail0: ParsedMail) {
  const repo = yield* Repo;
  const telegram = yield* Telegram;
  const mail: ParsedMail = { ...mail0, from: originalSender(mail0) };
  const kind = classify(mail);
  const runId = yield* repo.startRun("email");

  if (kind === "upwork-alert" || kind === "linkedin-alert" || kind === "djinni-alert") {
    const extracted = extractJobs(mail, kind);
    const inserted = yield* ingestExtracted(extracted);
    yield* repo.finishRun(runId, true, { kind, extracted: extracted.length, inserted });
    if (inserted > 0 && kind !== "djinni-alert")
      yield* telegram.send(`📬 ${inserted} new ${kind.split("-")[0]} job${inserted > 1 ? "s" : ""} from an alert, scoring now.`, { silent: true });
    return;
  }

  if (kind === "linkedin-message" || kind === "djinni-message" || kind === "upwork-message") {
    const channel = kind.split("-")[0]!;
    const contactId = yield* repo.upsertContact({ email: null, name: mail.fromName || null, company: null, channel });
    const messageId = newId();
    const stored = yield* repo.insertMessage({
      id: messageId,
      contactId,
      jobId: null,
      direction: "in",
      channel,
      subject: mail.subject,
      bodyText: preview(mail, 4000),
      messageId: mail.messageId,
      receivedAt: mail.receivedAt,
    });
    yield* repo.finishRun(runId, true, { kind, stored: Boolean(stored) });
    if (!stored) return;
    yield* telegram.send(
      [`💬 <b>${escapeHtml(channel)} message</b> · ${escapeHtml(mail.subject)}`, escapeHtml(preview(mail, 700))].join("\n"),
      { keyboard: replyKeyboard(messageId) },
    );
    yield* repo.insertEvent({ kind: "reply_in", payload: JSON.stringify({ messageId, channel }), at: now() });
    return;
  }

  yield* repo.finishRun(runId, true, { kind: "unknown", from: mail.from });
  yield* telegram.send(
    [`📨 <b>Mail</b> from ${escapeHtml(mail.from)}`, `<b>${escapeHtml(mail.subject)}</b>`, escapeHtml(preview(mail))].join("\n"),
    { silent: true },
  );
});
