/**
 * The `email` handler body: parse the forwarded mail, classify it, and either create jobs
 * (alerts), record a conversation and ping Dan (messages), or preview it (unknown).
 */
import { Effect } from "effect";
import PostalMime from "postal-mime";

import { replyKeyboard } from "./Cards.ts";
import { newId, now } from "./Db.ts";
import type { Deps } from "./Deps.ts";
import { classify, extractJobs, preview, type ParsedMail } from "./Email.ts";
import { ingestExtracted } from "./Ingest.ts";
import { escapeHtml } from "./Telegram.ts";

export const parseMail = (raw: ReadableStream<Uint8Array> | ArrayBuffer | string) =>
  Effect.tryPromise({
    try: async () => {
      const parsed = await PostalMime.parse(raw as any);
      const mail: ParsedMail = {
        from: parsed.from?.address ?? "",
        fromName: parsed.from?.name ?? "",
        subject: parsed.subject ?? "",
        text: parsed.text ?? "",
        html: parsed.html ?? "",
        messageId: parsed.messageId ?? `<${crypto.randomUUID()}@growth>`,
        receivedAt: now(),
      };
      return mail;
    },
    catch: (e) => new Error(`mail parse failed: ${String(e)}`),
  });

/** Gmail forwards keep the original sender in the body; recover it when the envelope is Gmail. */
const originalSender = (mail: ParsedMail): string => {
  if (!/gmail\.com|googlemail\.com/i.test(mail.from)) return mail.from;
  const m = (mail.text || mail.html).match(/From:\s*[^<\n]*<([^>\s]+@[^>\s]+)>/i) || (mail.text || mail.html).match(/From:\s*([^\s<>]+@[^\s<>]+)/i);
  return m ? m[1]! : mail.from;
};

export const ingestMail = (deps: Deps, mail0: ParsedMail) =>
  Effect.gen(function* () {
    const mail: ParsedMail = { ...mail0, from: originalSender(mail0) };
    const kind = classify(mail);
    const runId = yield* deps.repo.startRun("email");
    const t = deps.telegram;

    if (kind === "upwork-alert" || kind === "linkedin-alert" || kind === "djinni-alert") {
      const extracted = extractJobs(mail, kind);
      const inserted = yield* ingestExtracted(deps, extracted);
      yield* deps.repo.finishRun(runId, true, { kind, extracted: extracted.length, inserted });
      if (inserted > 0 && kind !== "djinni-alert")
        yield* t.send(`📬 ${inserted} new ${kind.split("-")[0]} job${inserted > 1 ? "s" : ""} from an alert, scoring now.`, { silent: true });
      return;
    }

    if (kind === "linkedin-message" || kind === "djinni-message" || kind === "upwork-message") {
      const channel = kind.split("-")[0]!;
      const contactId = yield* deps.repo.upsertContact({ email: null, name: mail.fromName || null, company: null, channel });
      const messageId = newId();
      const stored = yield* deps.repo.insertMessage({
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
      yield* deps.repo.finishRun(runId, true, { kind, stored: Boolean(stored) });
      if (!stored) return;
      yield* t.send(
        [`💬 <b>${escapeHtml(channel)} message</b> · ${escapeHtml(mail.subject)}`, escapeHtml(preview(mail, 700))].join("\n"),
        { keyboard: replyKeyboard(messageId) },
      );
      yield* deps.repo.insertEvent({ kind: "reply_in", payload: JSON.stringify({ messageId, channel }), at: now() });
      return;
    }

    yield* deps.repo.finishRun(runId, true, { kind: "unknown", from: mail.from });
    yield* t.send([`📨 <b>Mail</b> from ${escapeHtml(mail.from)}`, `<b>${escapeHtml(mail.subject)}</b>`, escapeHtml(preview(mail))].join("\n"), { silent: true });
  });
