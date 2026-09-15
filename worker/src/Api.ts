/**
 * HTTP surface: the Telegram webhook, the routine API and the admin API. A small hand-rolled
 * router over the raw Cloudflare Request; every inbound body is decoded with a Schema before it
 * touches the database.
 */
import { Effect, Option, Redacted, Schema } from "effect";
import { HttpServerResponse } from "effect/unstable/http";

import { Background } from "./Bindings.ts";
import { appliedLine, applyPackage, draftKeyboard, formSettingsText, packageKeyboard, undoKeyboard, type Answer } from "./Cards.ts";
import { BadRequest } from "./Errors.ts";
import { cardFor, cardPendingDrafts, ingestDiscordPosts, ingestDjinniKeyword, ingestWeb3Source, jobDetail } from "./Ingest.ts";
import { Kv } from "./Kv.ts";
import { newId, now, Repo } from "./Repo.ts";
import { Routine } from "./Routine.ts";
import { Settings } from "./Settings.ts";
import { dailySummary } from "./Summary.ts";
import { escapeHtml, Telegram } from "./Telegram.ts";
import { isDiscordUrl, splitQuestions, unwrap } from "./Text.ts";
import { runTick } from "./Tick.ts";
import { isWeb3Source, WEB3_SOURCES } from "./Web3Lane.ts";

// ---------- schemas for what comes in ----------

const OptionalString = Schema.optionalKey(Schema.NullOr(Schema.String));

export const DraftBody = Schema.Struct({
  jobId: OptionalString,
  kind: Schema.optionalKey(Schema.String),
  draftId: OptionalString,
  messageId: OptionalString,
  message: Schema.optionalKey(Schema.String),
  language: OptionalString,
  salaryAsk: OptionalString,
  resumeVariant: OptionalString,
  formNotes: OptionalString,
  repoPath: OptionalString,
  runId: OptionalString,
  threadReply: OptionalString,
  answers: Schema.optionalKey(Schema.Array(Schema.Struct({ question: Schema.String, answer: Schema.String }))),
});

export const DiscordPostsBody = Schema.Struct({
  posts: Schema.Array(
    Schema.Struct({
      id: Schema.String,
      channel: Schema.String,
      author: Schema.String,
      authorId: OptionalString,
      content: Schema.String,
      url: Schema.String,
      createdAt: Schema.String,
    }),
  ),
});

export const RunBody = Schema.Struct({ runId: OptionalString, drafts: Schema.optionalKey(Schema.Number), replies: Schema.optionalKey(Schema.Number), skipped: Schema.optionalKey(Schema.Number), notes: OptionalString });

export const ResumeFileBody = Schema.Struct({ variant: Schema.String, fileId: Schema.String });

export const NotifyBody = Schema.Struct({ text: Schema.String });

/** The seed is a one-off admin import of legacy rows; rows are passed through as records. */
const SeedRow = Schema.Record(Schema.String, Schema.Unknown);
export const SeedBody = Schema.Struct({
  jobs: Schema.optionalKey(Schema.Array(SeedRow)),
  drafts: Schema.optionalKey(Schema.Array(SeedRow)),
  applications: Schema.optionalKey(Schema.Array(SeedRow)),
});

/** Only the parts of a Telegram update the bot reads; everything else is ignored. */
export const TelegramUpdate = Schema.Struct({
  callback_query: Schema.optionalKey(
    Schema.Struct({
      id: Schema.Union([Schema.String, Schema.Number]),
      data: Schema.optionalKey(Schema.String),
      message: Schema.optionalKey(Schema.Struct({ chat: Schema.optionalKey(Schema.Struct({ id: Schema.Union([Schema.String, Schema.Number]) })) })),
    }),
  ),
  message: Schema.optionalKey(
    Schema.Struct({
      message_id: Schema.optionalKey(Schema.Number),
      text: Schema.optionalKey(Schema.String),
      chat: Schema.optionalKey(Schema.Struct({ id: Schema.Union([Schema.String, Schema.Number]) })),
      reply_to_message: Schema.optionalKey(Schema.Struct({ message_id: Schema.Number })),
    }),
  ),
});

const parseAnswers = (s: string | null): Answer[] => {
  if (!s) return [];
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v.filter((a) => a && typeof a.question === "string" && typeof a.answer === "string") : [];
  } catch {
    return [];
  }
};

const parseQuestionsJson = (s: string | null): string[] => {
  if (!s) return [];
  try {
    const v = JSON.parse(s);
    return Array.isArray(v) ? v.filter((q) => typeof q === "string") : [];
  } catch {
    return [];
  }
};

// ---------- helpers ----------

const json = (body: unknown, status = 200) => HttpServerResponse.jsonUnsafe(body, { status });
const text = (body: string, status = 200) => HttpServerResponse.text(body, { status });

const bearer = (req: Request): string | null => {
  const h = req.headers.get("authorization") ?? "";
  return h.startsWith("Bearer ") ? h.slice(7).trim() : null;
};

const authorized = (req: Request, token: Option.Option<Redacted.Redacted<string>>): boolean =>
  Option.isSome(token) && bearer(req) === Redacted.value(token.value);

const decodeBody = <S extends Schema.Top>(schema: S) =>
  Effect.fn("Api.decodeBody")(function* (req: Request) {
    const raw = yield* Effect.tryPromise({ try: () => req.json(), catch: () => BadRequest.make({ message: "body is not JSON" }) });
    return yield* Schema.decodeUnknownEffect(schema)(raw).pipe(
      Effect.mapError((err) => BadRequest.make({ message: `invalid body: ${String(err).slice(0, 300)}` })),
    );
  });

const clientIp = (req: Request) => req.headers.get("cf-connecting-ip") ?? undefined;

// ---------- Telegram actions ----------

const draftWithJob = Effect.fn("Api.draftWithJob")(function* (draftId: string) {
  const repo = yield* Repo;
  const draft = yield* repo.draftById(draftId);
  if (!draft || !draft.jobId) return null;
  const job = yield* repo.jobById(draft.jobId);
  if (!job) return null;
  const score = yield* repo.scoreByJob(job.id);
  return { draft, job, card: cardFor(job, score, draft) };
});

/**
 * Render the package into the draft's own card: header, copyable text, screening answers,
 * form settings, and the buttons. Falls back to separate messages only when it is too long.
 */
/**
 * `resend` moves the message to the bottom of the chat (a fresh message with a note on top, the
 * old one deleted) so a change Dan is waiting for is where he looks, instead of a silent edit
 * somewhere above.
 */
const showPackage = Effect.fn("Api.showPackage")(function* (draftId: string, resend?: string) {
  const repo = yield* Repo;
  const telegram = yield* Telegram;
  const found = yield* draftWithJob(draftId);
  if (!found) return false;
  const { draft, job, card } = found;
  const discord = job.source === "discord" || isDiscordUrl(job.url);
  // Drafts stored before the normalizer still carry the routine's hard wraps; unwrap is idempotent.
  const message = unwrap(draft.message);
  const threadReply = draft.threadReply ? unwrap(draft.threadReply) : null;
  const answers = parseAnswers(draft.answers).map((a) => ({ question: unwrap(a.question), answer: unwrap(a.answer) }));
  const questions = draft.questions ? parseQuestionsJson(draft.questions) : (jobDetail(job).questions ?? []);
  const keyboard = packageKeyboard(draft.id, job.url, { discord, hasAnswers: answers.length > 0, hasQuestions: questions.length > 0 });
  const header = card.split("\n").slice(0, 3).join("\n");
  const body = applyPackage(header, message, formSettingsText(draft), answers, threadReply, discord);
  const pkg = resend ? `${resend}\n${body}` : body;
  if (!resend && pkg.length <= 4000 && draft.tgMessageId) {
    const edited = yield* telegram.edit(draft.tgMessageId, pkg, { keyboard }).pipe(Effect.as(true), Effect.catch(() => Effect.succeed(false)));
    if (edited) return true;
  }
  const mid = yield* telegram.send(pkg.length <= 4000 ? pkg : `${resend ? `${resend}\n` : ""}✅ <b>Applying</b>\n${header}`, { keyboard }).pipe(Effect.catch(() => Effect.succeed(-1)));
  if (mid > 0) {
    yield* repo.updateDraft(draft.id, { tgMessageId: mid });
    if (resend && draft.tgMessageId) yield* retireMessage(draft.tgMessageId, job.title);
  }
  if (pkg.length > 4000) {
    yield* telegram.send(`<pre>${escapeHtml(message)}</pre>`, { disablePreview: true });
    for (const a of answers) yield* telegram.send(`<b>${escapeHtml(a.question)}</b>\n<pre>${escapeHtml(a.answer)}</pre>`);
    if (discord && threadReply) yield* telegram.send(`<b>If DMs are closed, reply in the thread:</b>\n<pre>${escapeHtml(threadReply)}</pre>`);
    yield* telegram.send(formSettingsText(draft));
  }
  return mid > 0;
});

/** Delete a superseded message, or collapse it when Telegram no longer allows the delete. */
const retireMessage = Effect.fn("Api.retireMessage")(function* (messageId: number, title: string) {
  const telegram = yield* Telegram;
  yield* telegram.delete(messageId).pipe(
    Effect.catch(() => telegram.edit(messageId, `↓ ${escapeHtml(title)} moved below`).pipe(Effect.ignore)),
  );
});

/** Move a draft's card to the bottom of the chat with a note on top; the package when it is open. */
const resendCard = Effect.fn("Api.resendCard")(function* (draftId: string, note: string) {
  const repo = yield* Repo;
  const telegram = yield* Telegram;
  const found = yield* draftWithJob(draftId);
  if (!found) return false;
  const { draft, job, card } = found;
  if (draft.status === "approved") return yield* showPackage(draft.id, note);
  if (!["carded", "later"].includes(draft.status)) return false;
  const mid = yield* telegram.send(`${note}\n${card}`, { keyboard: draftKeyboard(draft.id) }).pipe(Effect.catch(() => Effect.succeed(-1)));
  if (mid <= 0) return false;
  yield* repo.updateDraft(draft.id, { tgMessageId: mid });
  if (draft.tgMessageId) yield* retireMessage(draft.tgMessageId, job.title);
  return true;
});

/** Apply: open the package. Nothing is recorded as sent until Dan taps Applied. */
const onApply = Effect.fn("Api.onApply")(function* (draftId: string) {
  const repo = yield* Repo;
  const found = yield* draftWithJob(draftId);
  if (!found) return "Draft not found";
  if (!(yield* repo.updateDraft(found.draft.id, { status: "approved" }, ["carded", "approved", "later"]))) return "Already handled";
  yield* repo.insertEvent({ jobId: found.job.id, draftId: found.draft.id, kind: "apply", at: now() });
  yield* showPackage(found.draft.id);
  return "Paste, send, then tap Applied";
});

/** Applied: the send happened on the platform; record it and collapse the card. */
const onApplied = Effect.fn("Api.onApplied")(function* (draftId: string) {
  const repo = yield* Repo;
  const telegram = yield* Telegram;
  const found = yield* draftWithJob(draftId);
  if (!found) return "Draft not found";
  const { draft, job } = found;
  if (!(yield* repo.updateDraft(draft.id, { status: "sent" }, "approved"))) return "Already handled";
  const appId = newId();
  yield* repo.insertApplication({
    id: appId,
    jobId: job.id,
    draftId: draft.id,
    sentAt: now(),
    salaryAsked: draft.salaryAsk,
    appsAtSend: jobDetail(job).applications ?? null,
    resumeVariant: draft.resumeVariant,
    language: draft.language,
    stage: "sent",
    stageAt: now(),
  });
  yield* repo.updateJob(job.id, { status: "applied" });
  yield* repo.insertEvent({ jobId: job.id, draftId: draft.id, kind: "sent", at: now() });
  if (draft.tgMessageId) yield* telegram.edit(draft.tgMessageId, appliedLine(job.title, job.company), { keyboard: undoKeyboard(appId) }).pipe(Effect.ignore);
  return "Recorded";
});

/** Questions: ask Dan to paste the recruiter's questions as a reply to the prompt. */
const onQuestions = Effect.fn("Api.onQuestions")(function* (draftId: string) {
  const telegram = yield* Telegram;
  const kv = yield* Kv;
  const found = yield* draftWithJob(draftId);
  if (!found) return "Draft not found";
  const pending = found.draft.questions && !found.draft.answers;
  if (pending) return "Questions are queued; answers arrive with the next routine run";
  const mid = yield* telegram.send(
    `❓ Reply to this message with the recruiter's questions for <b>${escapeHtml(found.job.title)}</b>, one per line.`,
    { forceReply: true },
  );
  if (mid > 0) yield* kv.put(`q:prompt:${mid}`, draftId, 7 * 86400);
  return "Waiting for your reply";
});

/** Pasted questions arrive as a Telegram reply to the prompt (or as /questions <draftId> …). */
const onQuestionsReply = Effect.fn("Api.onQuestionsReply")(function* (draftId: string, text: string) {
  const repo = yield* Repo;
  const routine = yield* Routine;
  const telegram = yield* Telegram;
  const questions = splitQuestions(text);
  if (!questions.length) return "No questions found in that reply";
  const moved = yield* repo.updateDraft(draftId, { questions: JSON.stringify(questions), answers: null }, ["carded", "approved", "later"]);
  if (!moved) return "That draft is closed";
  yield* repo.insertEvent({ draftId, kind: "questions", payload: JSON.stringify(questions), at: now() });
  const fired = yield* routine.fire(`questions for ${draftId}`);
  yield* telegram.send(
    `Got ${questions.length} question${questions.length > 1 ? "s" : ""}. ${routine.explain(fired)} The card comes back at the bottom of the chat with the answers.`,
    { silent: true },
  );
  return "Queued";
});

/** The resume PDF for a draft's variant, on demand. */
const onResume = Effect.fn("Api.onResume")(function* (draftId: string) {
  const repo = yield* Repo;
  const telegram = yield* Telegram;
  const kv = yield* Kv;
  const draft = yield* repo.draftById(draftId);
  const variant = draft?.resumeVariant ?? "fullstack";
  const fileId = yield* kv.get(`tg:file:${variant}`);
  if (!fileId) return `No resume file registered for ${variant}. Run scripts/upload-resumes.ts.`;
  yield* telegram.sendDocument(fileId, `Resume · ${escapeHtml(variant)}`);
  return "Sent";
});

const onSkip = Effect.fn("Api.onSkip")(function* (draftId: string) {
  const repo = yield* Repo;
  const telegram = yield* Telegram;
  const found = yield* draftWithJob(draftId);
  if (!found) return "Draft not found";
  const moved = yield* repo.updateDraft(draftId, { status: "skipped" }, ["carded", "approved", "later", "pending"]);
  yield* repo.updateJob(found.job.id, { status: "skipped", filterReason: "dan-skip" });
  yield* repo.insertEvent({ jobId: found.job.id, draftId, kind: "skip", at: now() });
  if (found.draft.tgMessageId) yield* telegram.edit(found.draft.tgMessageId, `⏭ <s>${escapeHtml(found.job.title)}</s> · skipped`);
  return moved ? "Skipped" : "Already handled";
});

const onLater = Effect.fn("Api.onLater")(function* (draftId: string) {
  const repo = yield* Repo;
  const telegram = yield* Telegram;
  const found = yield* draftWithJob(draftId);
  if (!found) return "Draft not found";
  if (!(yield* repo.updateDraft(draftId, { status: "later" }, ["carded", "approved"]))) return "Already handled";
  yield* repo.insertEvent({ jobId: found.job.id, draftId, kind: "later", at: now() });
  if (found.draft.tgMessageId) yield* telegram.edit(found.draft.tgMessageId, `🕓 ${escapeHtml(found.job.title)} · parked until the morning summary`);
  return "Parked";
});

const onDraftRequest = Effect.fn("Api.onDraftRequest")(function* (jobId: string) {
  const repo = yield* Repo;
  const telegram = yield* Telegram;
  const routine = yield* Routine;
  const job = yield* repo.jobById(jobId);
  if (!job) return "Job not found";
  yield* repo.updateJob(job.id, { hot: 1 });
  const score = yield* repo.scoreByJob(job.id);
  if (score && score.verdict === "skip") yield* repo.upsertScore({ ...score, verdict: "apply-low" });
  if (job.status !== "scored") yield* repo.updateJob(job.id, { status: "scored" });
  yield* repo.insertEvent({ jobId: job.id, kind: "draft-request", at: now() });
  const fired = yield* routine.fire(`draft requested for ${job.id}`);
  const when = routine.explain(fired);
  if (job.tgMessageId) yield* telegram.edit(job.tgMessageId, `✍️ Queued for drafting\n${escapeHtml(job.title)}\n${when}`).pipe(Effect.ignore);
  return fired.fired ? "Drafting now" : "Queued; see the card for when";
});

const onJobSkip = Effect.fn("Api.onJobSkip")(function* (jobId: string) {
  const repo = yield* Repo;
  const telegram = yield* Telegram;
  const job = yield* repo.jobById(jobId);
  if (!job) return "Job not found";
  yield* repo.updateJob(job.id, { status: "skipped", filterReason: "dan-skip" });
  yield* repo.insertEvent({ jobId: job.id, kind: "skip", at: now() });
  if (job.tgMessageId) yield* telegram.edit(job.tgMessageId, `⏭ <s>${escapeHtml(job.title)}</s> · skipped`);
  return "Skipped";
});

/** Undo an Applied tap: the ledger row is voided, the package comes back. */
const onNotSent = Effect.fn("Api.onNotSent")(function* (appId: string) {
  const repo = yield* Repo;
  const app = yield* repo.applicationById(appId);
  if (!app) return "Not found";
  yield* repo.updateApplication(appId, { stage: "not_sent", stageAt: now() });
  if (app.draftId) yield* repo.updateDraft(app.draftId, { status: "approved" }, "sent");
  // Back to `drafted`, never `scored`: `scored` would put the job back in the routine's queue.
  if (app.jobId) yield* repo.updateJob(app.jobId, { status: "drafted" });
  yield* repo.insertEvent({ jobId: app.jobId, draftId: app.draftId, kind: "not_sent", at: now() });
  if (app.draftId) yield* showPackage(app.draftId);
  return "Reverted";
});

const onReplyRequest = Effect.fn("Api.onReplyRequest")(function* (messageId: string) {
  const repo = yield* Repo;
  const routine = yield* Routine;
  const msg = yield* repo.messageById(messageId);
  if (!msg) return "Message not found";
  yield* repo.insertDraft({ id: newId(), jobId: msg.jobId, kind: "reply", message: "", messageId, status: "requested", createdAt: now() });
  const fired = (yield* routine.fire(`reply requested for ${messageId}`)).fired;
  return fired ? "Routine is drafting the reply" : "Reply queued for the next routine run";
});

const onCommand = Effect.fn("Api.onCommand")(function* (chatId: string, textIn: string) {
  const repo = yield* Repo;
  const routine = yield* Routine;
  const [cmd, ...rest] = textIn.trim().split(/\s+/);
  switch (cmd) {
    case "/start":
      return `Hello. This chat id is <code>${escapeHtml(chatId)}</code>. Put it in TELEGRAM_CHAT_ID.`;
    case "/ping":
      return "pong";
    case "/summary":
      yield* dailySummary();
      return null;
    case "/queue": {
      const waiting = yield* repo.queueJobs(8);
      if (!waiting.length) return "Nothing waiting for a draft.";
      return waiting.map((w) => `${w.job.hot ? "🔥 " : ""}${escapeHtml(w.job.title)} · ${escapeHtml(w.job.company ?? "?")} · ${w.score.total}/20`).join("\n");
    }
    case "/fire":
      return routine.explain(yield* routine.fire("manual /fire"));
    case "/questions": {
      const [draftId, ...q] = rest;
      if (!draftId || !q.length) return "Usage: /questions <draftId> <questions, one per line>";
      return yield* onQuestionsReply(draftId, q.join(" "));
    }
    case "/stage": {
      const [appId, stage] = rest;
      if (!appId || !stage) return "Usage: /stage <applicationId> <viewed|replied|call|test|offer|hired|rejected>";
      yield* repo.updateApplication(appId, { stage, stageAt: now() });
      yield* repo.insertEvent({ kind: "stage", payload: JSON.stringify({ appId, stage }), at: now() });
      return `Stage set to ${escapeHtml(stage)}.`;
    }
    default:
      return null;
  }
});

const callbackAction = (kind: string, id: string): Effect.Effect<string, unknown, any> => {
  switch (kind) {
    case "a":
      return onApply(id);
    case "s":
      return onSkip(id);
    case "l":
      return onLater(id);
    case "d":
      return onDraftRequest(id);
    case "x":
      return onJobSkip(id);
    case "n":
      return onNotSent(id);
    case "p":
      return onResume(id);
    case "ok":
      return onApplied(id);
    case "q":
      return onQuestions(id);
    case "r":
      return onReplyRequest(id);
    default:
      return Effect.succeed("Unknown action");
  }
};

const handleUpdate = Effect.fn("Api.handleUpdate")(function* (update: typeof TelegramUpdate.Type) {
  const telegram = yield* Telegram;
  const cb = update.callback_query;
  if (cb) {
    const fromChat = String(cb.message?.chat?.id ?? "");
    if (telegram.configured && fromChat !== telegram.chatId) return;
    const data = cb.data ?? "";
    const sep = data.indexOf(":");
    const kind = sep > -1 ? data.slice(0, sep) : data;
    const id = sep > -1 ? data.slice(sep + 1) : "";
    const result = yield* callbackAction(kind, id).pipe(
      Effect.catch((err) => Effect.logWarning("callback failed", { data, err: String(err) }).pipe(Effect.as("Something failed, check logs"))),
    );
    yield* telegram.answerCallback(String(cb.id), result).pipe(Effect.ignore);
    return;
  }
  const msg = update.message;
  if (msg?.text) {
    const chatId = String(msg.chat?.id ?? "");
    if (telegram.configured && chatId !== telegram.chatId && !msg.text.startsWith("/start")) return;
    if (msg.reply_to_message) {
      const kv = yield* Kv;
      const draftId = yield* kv.get(`q:prompt:${msg.reply_to_message.message_id}`);
      if (draftId) {
        yield* kv.delete(`q:prompt:${msg.reply_to_message.message_id}`);
        yield* onQuestionsReply(draftId, msg.text).pipe(Effect.catch((err) => Effect.succeed(`Failed: ${String(err)}`)));
        return;
      }
    }
    const command: Effect.Effect<string | null, unknown, any> = onCommand(chatId, msg.text);
    const reply = yield* command.pipe(Effect.catch((err) => Effect.succeed(`Failed: ${escapeHtml(String(err))}`)));
    if (!reply) return;
    if (telegram.configured && chatId === telegram.chatId) yield* telegram.send(reply);
    else yield* telegram.call("sendMessage", { chat_id: chatId, text: reply, parse_mode: "HTML" }).pipe(Effect.ignore);
  }
});

// ---------- routine + admin ----------

const queuePayload = Effect.fn("Api.queuePayload")(function* () {
  const repo = yield* Repo;
  const runId = yield* repo.startRun("routine");
  const waiting = yield* repo.queueJobs(8);
  const replies = yield* repo.queueReplies(3);
  const questions = yield* repo.queueQuestions(3);
  for (const w of waiting) yield* repo.updateJob(w.job.id, { status: "drafting" }, "scored");
  return {
    runId,
    items: [
      ...waiting.map((w) => ({
        kind: "application",
        job: {
          id: w.job.id,
          source: w.job.source,
          title: w.job.title,
          company: w.job.company,
          url: w.job.url,
          description: w.job.description,
          postedAt: w.job.postedAt,
          detail: jobDetail(w.job),
          flags: JSON.parse(w.job.flags) as string[],
          hot: w.job.hot === 1,
          score: { total: w.score.total, verdict: w.score.verdict, summary: w.score.summary, language: w.score.language },
        },
      })),
      ...questions.map((q) => ({
        kind: "questions",
        draftId: q.draft.id,
        repoPath: q.draft.repoPath,
        job: { id: q.job.id, source: q.job.source, title: q.job.title, company: q.job.company, url: q.job.url, description: q.job.description.slice(0, 3000) },
        draft: { message: q.draft.message, questions: parseQuestionsJson(q.draft.questions) },
      })),
      ...replies.map((r) => ({
        kind: "reply",
        draftId: r.draft.id,
        messageId: r.message.id,
        job: r.message.jobId ? { id: r.message.jobId } : null,
        message: {
          subject: r.message.subject,
          body: r.message.bodyText,
          channel: r.message.channel,
          contact: r.contact ? { name: r.contact.name, email: r.contact.email, company: r.contact.company } : null,
        },
      })),
    ],
  };
});

const acceptDraft = Effect.fn("Api.acceptDraft")(function* (body: typeof DraftBody.Type) {
  const repo = yield* Repo;
  const telegram = yield* Telegram;
  const kind = body.kind ?? "application";
  const jobId = body.jobId ?? null;
  const message = unwrap(body.message ?? "");
  const formNotes = body.formNotes ? unwrap(body.formNotes) : null;
  const threadReply = body.threadReply ? unwrap(body.threadReply) : null;
  const answers: Answer[] = (body.answers ?? []).map((a) => ({ question: unwrap(a.question), answer: unwrap(a.answer) }));

  if (kind === "answers" && body.draftId) {
    const draft = yield* repo.draftById(body.draftId);
    if (!draft) return { ok: false, error: "unknown draft" };
    yield* repo.updateDraft(draft.id, { answers: JSON.stringify(answers), runId: body.runId ?? draft.runId });
    yield* resendCard(draft.id, `❓ <b>Answers added</b> (${answers.length})`);
    return { ok: true };
  }

  if (kind === "skip" && jobId) {
    yield* repo.updateJob(jobId, { status: "skipped", filterReason: `routine: ${formNotes ?? ""}`.slice(0, 200) });
    const job = yield* repo.jobById(jobId);
    if (job?.tgMessageId)
      yield* telegram
        .edit(job.tgMessageId, `⛔ <s>${escapeHtml(job.title)}</s>\nSkipped by the routine: ${escapeHtml((formNotes ?? "no reason given").slice(0, 300))}`)
        .pipe(Effect.ignore);
    return { ok: true };
  }
  if (kind === "reply") {
    if (body.draftId)
      yield* repo.updateDraft(body.draftId, {
        message,
        status: "carded",
        language: body.language ?? null,
        repoPath: body.repoPath ?? null,
        runId: body.runId ?? null,
      });
    const msg = body.messageId ? yield* repo.messageById(body.messageId) : null;
    yield* telegram.send([`✉️ <b>Reply draft</b>${msg?.subject ? ` · ${escapeHtml(msg.subject)}` : ""}`, escapeHtml(message)].join("\n\n"));
    return { ok: true };
  }
  if (!jobId) return { ok: false, error: "jobId required" };
  const job = yield* repo.jobById(jobId);
  if (!job) return { ok: false, error: "unknown job" };

  const draftId = newId();
  const questions = jobDetail(job).questions ?? [];
  yield* repo.insertDraft({
    id: draftId,
    jobId,
    kind,
    message,
    language: body.language ?? null,
    salaryAsk: body.salaryAsk ?? null,
    resumeVariant: body.resumeVariant ?? "fullstack",
    formNotes,
    threadReply,
    questions: questions.length ? JSON.stringify(questions) : null,
    answers: answers.length ? JSON.stringify(answers) : null,
    repoPath: body.repoPath ?? null,
    runId: body.runId ?? null,
    status: "pending",
    createdAt: now(),
  });
  yield* repo.updateJob(jobId, { status: "drafted" });

  // Card it now: edit the job card if one exists, else send a fresh one. A failed send leaves
  // the draft pending and the tick retries.
  const found = yield* draftWithJob(draftId);
  if (found) {
    const keyboard = draftKeyboard(draftId);
    let mid = -1;
    if (job.tgMessageId) {
      const edited = yield* telegram.edit(job.tgMessageId, found.card, { keyboard }).pipe(Effect.as(true), Effect.catch(() => Effect.succeed(false)));
      if (edited) mid = job.tgMessageId;
    }
    if (mid < 0) mid = yield* telegram.send(found.card, { keyboard, silent: job.hot !== 1 }).pipe(Effect.catch(() => Effect.succeed(-1)));
    if (mid > 0) {
      yield* repo.updateDraft(draftId, { status: "carded", tgMessageId: mid });
      yield* repo.insertEvent({ jobId, draftId, kind: "card", at: now() });
    }
  }
  return { ok: true, draftId };
});

const adminStats = Effect.fn("Api.adminStats")(function* () {
  const repo = yield* Repo;
  return yield* repo.stats(new Date(Date.now() - 86400000).toISOString(), new Date(Date.now() - 7 * 86400000).toISOString());
});

const seed = Effect.fn("Api.seed")(function* (body: typeof SeedBody.Type) {
  const repo = yield* Repo;
  const telegram = yield* Telegram;
  const jobs = body.jobs ?? [];
  const drafts = body.drafts ?? [];
  const apps = body.applications ?? [];
  if (jobs.length) yield* repo.insertJobs(jobs.map((j) => ({ ...(j as any), firstSeenAt: (j.firstSeenAt as string | undefined) ?? now(), updatedAt: now() })));
  for (const d of drafts) {
    const draftId = (d.id as string | undefined) ?? newId();
    yield* repo.insertDraft({ ...(d as any), id: draftId, status: "pending", createdAt: (d.createdAt as string | undefined) ?? now() });
    const found = yield* draftWithJob(draftId);
    if (found) {
      const mid = yield* telegram.send(found.card, { keyboard: draftKeyboard(draftId) }).pipe(Effect.catch(() => Effect.succeed(-1)));
      if (mid > 0) yield* repo.updateDraft(draftId, { status: "carded", tgMessageId: mid });
      if (typeof d.jobId === "string") yield* repo.updateJob(d.jobId, { status: "drafted" });
    }
  }
  for (const a of apps)
    yield* repo.insertApplication({ ...(a as any), id: (a.id as string | undefined) ?? newId(), stageAt: (a.stageAt as string | undefined) ?? (a.sentAt as string | undefined) ?? now() });
  return { jobs: jobs.length, drafts: drafts.length, applications: apps.length };
});

// ---------- router ----------

export const handleRequest = Effect.fn("Api.handleRequest")(
  function* (req: Request) {
    const settings = yield* Settings;
    const background = yield* Background;
    const repo = yield* Repo;
    const telegram = yield* Telegram;
    const kv = yield* Kv;

    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const method = req.method.toUpperCase();

    if (path === "/" || path === "/health") return json({ ok: true, at: now() });

    if (path === "/telegram" && method === "POST") {
      const secret = settings.webhookSecret;
      if (Option.isSome(secret) && req.headers.get("x-telegram-bot-api-secret-token") !== Redacted.value(secret.value)) return text("forbidden", 403);
      const update = yield* decodeBody(TelegramUpdate)(req).pipe(Effect.catch(() => Effect.succeed({} as typeof TelegramUpdate.Type)));
      yield* background.run(handleUpdate(update).pipe(Effect.catchCause((c) => Effect.logError("update failed", { cause: String(c) }))));
      return text("ok");
    }

    if (path.startsWith("/api/admin/")) {
      if (!authorized(req, settings.adminToken)) return text("unauthorized", 401);
      if (path === "/api/admin/stats" && method === "GET") return json(yield* adminStats());
      if (path === "/api/admin/ingest" && method === "POST") return json(yield* ingestDjinniKeyword(url.searchParams.get("keyword") ?? "Fullstack"));
      if (path === "/api/admin/tick" && method === "POST") {
        yield* runTick(Date.now(), { force: url.searchParams.get("force") === "1" });
        return json({ ok: true });
      }
      if (path === "/api/admin/resend" && method === "POST") {
        const draftId = url.searchParams.get("draftId") ?? "";
        return json({ ok: yield* resendCard(draftId, url.searchParams.get("note") ?? "🔁 <b>Moved here</b>") });
      }
      if (path === "/api/admin/card-pending" && method === "POST") {
        const sent = yield* cardPendingDrafts(10);
        return json({ ok: true, sent, telegram: { configured: telegram.configured, chatId: telegram.chatId } });
      }
      if (path === "/api/admin/seed" && method === "POST") return json(yield* seed(yield* decodeBody(SeedBody)(req)));
      if (path === "/api/admin/resume-files" && method === "POST") {
        const body = yield* decodeBody(ResumeFileBody)(req);
        yield* kv.put(`tg:file:${body.variant}`, body.fileId);
        return json({ ok: true });
      }
      if (path === "/api/admin/ingest-web3" && method === "POST") {
        const source = url.searchParams.get("source") ?? "";
        if (!isWeb3Source(source)) return yield* BadRequest.make({ message: `source must be one of ${WEB3_SOURCES.join(", ")}` });
        return json(yield* ingestWeb3Source(source));
      }
      if (path === "/api/admin/ingest-discord" && method === "POST") {
        const body = yield* decodeBody(DiscordPostsBody)(req);
        return json(yield* ingestDiscordPosts(body.posts));
      }
      if (path === "/api/admin/summary" && method === "POST") {
        yield* dailySummary();
        return json({ ok: true });
      }
      if (path === "/api/admin/notify" && method === "POST") {
        const body = yield* decodeBody(NotifyBody)(req);
        yield* telegram.send(escapeHtml(body.text));
        return json({ ok: true });
      }
      return text("not found", 404);
    }

    if (path.startsWith("/api/")) {
      if (!authorized(req, settings.routineToken)) return text("unauthorized", 401);
      if (path === "/api/queue" && method === "GET") return json(yield* queuePayload());
      if (path === "/api/drafts" && method === "POST") return json(yield* acceptDraft(yield* decodeBody(DraftBody)(req)));
      if (path === "/api/runs" && method === "POST") {
        const body = yield* decodeBody(RunBody)(req);
        if (body.runId) yield* repo.finishRun(body.runId, true, { ...body, ip: clientIp(req) });
        return json({ ok: true });
      }
      return text("not found", 404);
    }

    return text("not found", 404);
  },
  Effect.catchTag("BadRequest", (err) => Effect.succeed(json({ ok: false, error: err.message }, 400))),
  Effect.catchCause((cause) => Effect.logError("request failed", { cause: String(cause) }).pipe(Effect.as(json({ ok: false, error: "internal" }, 500)))),
);
