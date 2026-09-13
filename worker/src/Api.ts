/**
 * HTTP surface: the Telegram webhook, the routine API and the admin API. A hand-rolled router
 * over the raw Cloudflare Request keeps the CPU budget and the dependency surface small.
 */
import { Effect, Option, Redacted } from "effect";
import { HttpServerResponse } from "effect/unstable/http";

import { draftKeyboard, formSettingsText, jobCard, sentKeyboard } from "./Cards.ts";
import { newId, now } from "./Db.ts";
import type { Deps } from "./Deps.ts";
import { fireRoutine } from "./Fire.ts";
import { ingestDjinniKeyword, jobDetail, jobFlags } from "./Ingest.ts";
import { dailySummary } from "./Summary.ts";
import { escapeHtml } from "./Telegram.ts";
import { runTick } from "./Tick.ts";

type Json = Record<string, unknown>;

const json = (body: unknown, status = 200) => HttpServerResponse.jsonUnsafe(body, { status });
const text = (body: string, status = 200) => HttpServerResponse.text(body, { status });

const bearer = (req: Request): string | null => {
  const h = req.headers.get("authorization") ?? "";
  return h.startsWith("Bearer ") ? h.slice(7).trim() : null;
};

const authorized = (req: Request, token: Option.Option<Redacted.Redacted<string>>): boolean =>
  Option.isSome(token) && bearer(req) === Redacted.value(token.value);

const readJson = (req: Request) =>
  Effect.tryPromise({ try: () => req.json() as Promise<Json>, catch: (e) => new Error(`bad json: ${String(e)}`) });

const clientIp = (req: Request) => req.headers.get("cf-connecting-ip") ?? undefined;

// ---------- Telegram actions ----------

const cardTextForDraft = (deps: Deps, draftId: string) =>
  Effect.gen(function* () {
    const draft = yield* deps.repo.draftById(draftId);
    if (!draft || !draft.jobId) return null;
    const job = yield* deps.repo.jobById(draft.jobId);
    if (!job) return null;
    const sc = yield* deps.repo.scoreByJob(job.id);
    const card = jobCard(
      {
        id: job.id,
        source: job.source,
        title: job.title,
        company: job.company,
        url: job.url,
        postedAt: job.postedAt,
        firstSeenAt: job.firstSeenAt,
        flags: jobFlags(job),
        hot: job.hot === 1,
        detail: jobDetail(job) as Record<string, any>,
      },
      sc ? { total: sc.total, verdict: sc.verdict, summary: sc.summary } : null,
      { id: draft.id, kind: draft.kind, salaryAsk: draft.salaryAsk, resumeVariant: draft.resumeVariant, language: draft.language },
    );
    return { draft, job, card };
  });

/** Apply: hand Dan everything he needs to send, and record the send in the ledger. */
const onApply = (deps: Deps, draftId: string) =>
  Effect.gen(function* () {
    const found = yield* cardTextForDraft(deps, draftId);
    if (!found) return "Draft not found";
    const { draft, job, card } = found;
    const moved = yield* deps.repo.updateDraft(draft.id, { status: "approved" }, "carded");
    if (!moved) return "Already handled";

    const appId = newId();
    const detail = jobDetail(job);
    yield* deps.repo.insertApplication({
      id: appId,
      jobId: job.id,
      draftId: draft.id,
      sentAt: now(),
      salaryAsked: draft.salaryAsk,
      appsAtSend: detail.applications ?? null,
      resumeVariant: draft.resumeVariant,
      language: draft.language,
      stage: "sent",
      stageAt: now(),
    });
    yield* deps.repo.updateDraft(draft.id, { status: "sent" });
    yield* deps.repo.updateJob(job.id, { status: "applied" });
    yield* deps.repo.insertEvent({ jobId: job.id, draftId: draft.id, kind: "apply", at: now() });

    const t = deps.telegram;
    if (draft.tgMessageId) yield* t.edit(draft.tgMessageId, `✅ <b>Applying</b>\n${card}`, { keyboard: sentKeyboard(appId) });
    yield* t.send(escapeHtml(draft.message), { disablePreview: true });
    yield* t.send(formSettingsText(draft));
    const variant = draft.resumeVariant ?? "fullstack";
    const fileId = yield* deps.kv.get(`tg:file:${variant}`);
    if (fileId) yield* t.sendDocument(fileId, `Resume · ${escapeHtml(variant)}`);
    else yield* t.send(`No resume file registered for <b>${escapeHtml(variant)}</b>. Run scripts/upload-resumes.ts.`);
    yield* t.send(`<a href="${escapeHtml(job.url)}">Open the post and send</a>`, { disablePreview: false });
    return "Sent you everything";
  });

const onSkip = (deps: Deps, draftId: string) =>
  Effect.gen(function* () {
    const found = yield* cardTextForDraft(deps, draftId);
    if (!found) return "Draft not found";
    const moved = yield* deps.repo.updateDraft(draftId, { status: "skipped" });
    yield* deps.repo.updateJob(found.job.id, { status: "skipped", filterReason: "dan-skip" });
    yield* deps.repo.insertEvent({ jobId: found.job.id, draftId, kind: "skip", at: now() });
    if (found.draft.tgMessageId) yield* deps.telegram.edit(found.draft.tgMessageId, `⏭ <s>${escapeHtml(found.job.title)}</s> · skipped`);
    return moved ? "Skipped" : "Already handled";
  });

const onLater = (deps: Deps, draftId: string) =>
  Effect.gen(function* () {
    const found = yield* cardTextForDraft(deps, draftId);
    if (!found) return "Draft not found";
    yield* deps.repo.updateDraft(draftId, { status: "later" });
    yield* deps.repo.insertEvent({ jobId: found.job.id, draftId, kind: "later", at: now() });
    if (found.draft.tgMessageId) yield* deps.telegram.edit(found.draft.tgMessageId, `🕓 ${escapeHtml(found.job.title)} · parked until the morning summary`);
    return "Parked";
  });

const onDraftRequest = (deps: Deps, jobId: string) =>
  Effect.gen(function* () {
    const job = yield* deps.repo.jobById(jobId);
    if (!job) return "Job not found";
    yield* deps.repo.updateJob(job.id, { hot: 1 });
    const sc = yield* deps.repo.scoreByJob(job.id);
    if (sc && sc.verdict === "skip") yield* deps.repo.upsertScore({ ...sc, verdict: "apply-low" });
    if (job.status !== "scored") yield* deps.repo.updateJob(job.id, { status: "scored" });
    yield* deps.repo.insertEvent({ jobId: job.id, kind: "draft-request", at: now() });
    if (job.tgMessageId) yield* deps.telegram.edit(job.tgMessageId, `✍️ Queued for drafting\n${escapeHtml(job.title)}`);
    const fired = yield* fireRoutine(deps, `draft requested for ${job.id}`);
    return fired ? "Queued and the routine is running" : "Queued for the next routine run";
  });

const onJobSkip = (deps: Deps, jobId: string) =>
  Effect.gen(function* () {
    const job = yield* deps.repo.jobById(jobId);
    if (!job) return "Job not found";
    yield* deps.repo.updateJob(job.id, { status: "skipped", filterReason: "dan-skip" });
    yield* deps.repo.insertEvent({ jobId: job.id, kind: "skip", at: now() });
    if (job.tgMessageId) yield* deps.telegram.edit(job.tgMessageId, `⏭ <s>${escapeHtml(job.title)}</s> · skipped`);
    return "Skipped";
  });

const onNotSent = (deps: Deps, appId: string) =>
  Effect.gen(function* () {
    const app = yield* deps.repo.applicationById(appId);
    if (!app) return "Not found";
    yield* deps.repo.updateApplication(appId, { stage: "not_sent", stageAt: now() });
    if (app.draftId) yield* deps.repo.updateDraft(app.draftId, { status: "carded" });
    if (app.jobId) yield* deps.repo.updateJob(app.jobId, { status: "scored" });
    yield* deps.repo.insertEvent({ jobId: app.jobId, draftId: app.draftId, kind: "not_sent", at: now() });
    return "Reverted";
  });

const onReplyRequest = (deps: Deps, messageId: string) =>
  Effect.gen(function* () {
    const msg = yield* deps.repo.messageById(messageId);
    if (!msg) return "Message not found";
    yield* deps.repo.insertDraft({
      id: newId(),
      jobId: msg.jobId,
      kind: "reply",
      message: "",
      messageId,
      status: "requested",
      createdAt: now(),
    });
    const fired = yield* fireRoutine(deps, `reply requested for ${messageId}`);
    return fired ? "Routine is drafting the reply" : "Reply queued for the next routine run";
  });

const onCommand = (deps: Deps, chatId: string, textIn: string) =>
  Effect.gen(function* () {
    const [cmd, ...rest] = textIn.trim().split(/\s+/);
    switch (cmd) {
      case "/start":
        return `Hello. This chat id is <code>${escapeHtml(chatId)}</code>. Put it in TELEGRAM_CHAT_ID.`;
      case "/ping":
        return "pong";
      case "/summary":
        yield* dailySummary(deps);
        return null;
      case "/queue": {
        const waiting = yield* deps.repo.queueJobs(8);
        if (!waiting.length) return "Nothing waiting for a draft.";
        return waiting.map((w) => `${w.job.hot ? "🔥 " : ""}${escapeHtml(w.job.title)} · ${escapeHtml(w.job.company ?? "?")} · ${w.score.total}/20`).join("\n");
      }
      case "/fire": {
        const ok = yield* fireRoutine(deps, "manual /fire");
        return ok ? "Fired." : "Not fired (budget, gap, or not configured).";
      }
      case "/stage": {
        const [appId, stage] = rest;
        if (!appId || !stage) return "Usage: /stage <applicationId> <viewed|replied|call|test|offer|hired|rejected>";
        yield* deps.repo.updateApplication(appId, { stage, stageAt: now() });
        yield* deps.repo.insertEvent({ kind: "stage", payload: JSON.stringify({ appId, stage }), at: now() });
        return `Stage set to ${escapeHtml(stage)}.`;
      }
      default:
        return null;
    }
  });

const handleUpdate = (deps: Deps, update: any) =>
  Effect.gen(function* () {
    const t = deps.telegram;
    const cb = update?.callback_query;
    if (cb) {
      const fromChat = String(cb.message?.chat?.id ?? "");
      if (t.configured && fromChat !== t.chatId) return;
      const data: string = String(cb.data ?? "");
      const [kind, id] = data.split(":", 2) as [string, string];
      const action = (): Effect.Effect<string, unknown, any> => {
        switch (kind) {
          case "a":
            return onApply(deps, id);
          case "s":
            return onSkip(deps, id);
          case "l":
            return onLater(deps, id);
          case "d":
            return onDraftRequest(deps, id);
          case "x":
            return onJobSkip(deps, id);
          case "n":
            return onNotSent(deps, id);
          case "r":
            return onReplyRequest(deps, id);
          default:
            return Effect.succeed("Unknown action");
        }
      };
      const result = yield* action().pipe(
        Effect.catch((err) => Effect.logWarning("callback failed", { data, err: String(err) }).pipe(Effect.as("Something failed, check logs"))),
      );
      yield* t.answerCallback(String(cb.id), result).pipe(Effect.ignore);
      return;
    }
    const msg = update?.message;
    if (msg?.text) {
      const chatId = String(msg.chat?.id ?? "");
      if (t.configured && chatId !== t.chatId && !String(msg.text).startsWith("/start")) return;
      const command: Effect.Effect<string | null, unknown, any> = onCommand(deps, chatId, String(msg.text));
      const reply = yield* command.pipe(Effect.catch((err) => Effect.succeed(`Failed: ${escapeHtml(String(err))}`)));
      if (reply) {
        if (t.configured && chatId === t.chatId) yield* t.send(reply);
        else yield* t.call("sendMessage", { chat_id: chatId, text: reply, parse_mode: "HTML" }).pipe(Effect.ignore);
      }
    }
  });

// ---------- routine + admin ----------

const queuePayload = (deps: Deps) =>
  Effect.gen(function* () {
    const runId = yield* deps.repo.startRun("routine");
    const waiting = yield* deps.repo.queueJobs(8);
    const replies = yield* deps.repo.queueReplies(3);
    for (const w of waiting) yield* deps.repo.updateJob(w.job.id, { status: "drafting" }, "scored");
    const items = [
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
          flags: jobFlags(w.job),
          hot: w.job.hot === 1,
          score: { total: w.score.total, verdict: w.score.verdict, summary: w.score.summary, language: w.score.language },
        },
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
    ];
    return { runId, items };
  });

const acceptDraft = (deps: Deps, body: Json) =>
  Effect.gen(function* () {
    const kind = String(body.kind ?? "application");
    const jobId = body.jobId ? String(body.jobId) : null;
    if (kind === "skip" && jobId) {
      yield* deps.repo.updateJob(jobId, { status: "skipped", filterReason: `routine: ${String(body.formNotes ?? "")}`.slice(0, 200) });
      return { ok: true };
    }
    if (kind === "reply") {
      const draftId = body.draftId ? String(body.draftId) : null;
      const messageId = body.messageId ? String(body.messageId) : null;
      const message = String(body.message ?? "");
      if (draftId) yield* deps.repo.updateDraft(draftId, { message, status: "carded", language: body.language ? String(body.language) : null, repoPath: body.repoPath ? String(body.repoPath) : null, runId: body.runId ? String(body.runId) : null });
      const msg = messageId ? yield* deps.repo.messageById(messageId) : null;
      yield* deps.telegram.send(
        [`✉️ <b>Reply draft</b>${msg?.subject ? ` · ${escapeHtml(msg.subject)}` : ""}`, escapeHtml(message)].join("\n\n"),
      );
      return { ok: true };
    }
    if (!jobId) return { ok: false, error: "jobId required" };
    const job = yield* deps.repo.jobById(jobId);
    if (!job) return { ok: false, error: "unknown job" };
    const draftId = newId();
    yield* deps.repo.insertDraft({
      id: draftId,
      jobId,
      kind,
      message: String(body.message ?? ""),
      language: body.language ? String(body.language) : null,
      salaryAsk: body.salaryAsk ? String(body.salaryAsk) : null,
      resumeVariant: body.resumeVariant ? String(body.resumeVariant) : "fullstack",
      formNotes: body.formNotes ? String(body.formNotes) : null,
      repoPath: body.repoPath ? String(body.repoPath) : null,
      runId: body.runId ? String(body.runId) : null,
      status: "pending",
      createdAt: now(),
    });
    yield* deps.repo.updateJob(jobId, { status: "drafted" });
    // Card it now: edit the job card if one exists, else send a fresh one.
    const found = yield* cardTextForDraft(deps, draftId);
    if (found) {
      const keyboard = draftKeyboard(draftId);
      let mid = -1;
      if (job.tgMessageId) {
        const edited = yield* deps.telegram.edit(job.tgMessageId, found.card, { keyboard }).pipe(Effect.map(() => true), Effect.catch(() => Effect.succeed(false)));
        if (edited) mid = job.tgMessageId;
      }
      if (mid < 0) mid = yield* deps.telegram.send(found.card, { keyboard, silent: job.hot !== 1 }).pipe(Effect.catch(() => Effect.succeed(-1)));
      if (mid > 0) {
        yield* deps.repo.updateDraft(draftId, { status: "carded", tgMessageId: mid });
        yield* deps.repo.insertEvent({ jobId, draftId, kind: "card", at: now() });
      }
    }
    return { ok: true, draftId };
  });

const adminStats = (deps: Deps) =>
  Effect.gen(function* () {
    const day = new Date(Date.now() - 86400000).toISOString();
    const week = new Date(Date.now() - 7 * 86400000).toISOString();
    return yield* deps.repo.stats(day, week);
  });

const seed = (deps: Deps, body: Json) =>
  Effect.gen(function* () {
    const jobs = Array.isArray(body.jobs) ? (body.jobs as any[]) : [];
    const drafts = Array.isArray(body.drafts) ? (body.drafts as any[]) : [];
    const apps = Array.isArray(body.applications) ? (body.applications as any[]) : [];
    if (jobs.length) yield* deps.repo.insertJobs(jobs.map((j) => ({ ...j, firstSeenAt: j.firstSeenAt ?? now(), updatedAt: now() })));
    for (const d of drafts) {
      const draftId = d.id ?? newId();
      yield* deps.repo.insertDraft({ ...d, id: draftId, status: "pending", createdAt: d.createdAt ?? now() });
      const found = yield* cardTextForDraft(deps, draftId);
      if (found) {
        const mid = yield* deps.telegram.send(found.card, { keyboard: draftKeyboard(draftId) }).pipe(Effect.catch(() => Effect.succeed(-1)));
        if (mid > 0) yield* deps.repo.updateDraft(draftId, { status: "carded", tgMessageId: mid });
        if (d.jobId) yield* deps.repo.updateJob(String(d.jobId), { status: "drafted" });
      }
    }
    for (const a of apps) yield* deps.repo.insertApplication({ ...a, id: a.id ?? newId(), stageAt: a.stageAt ?? a.sentAt ?? now() });
    return { jobs: jobs.length, drafts: drafts.length, applications: apps.length };
  });

// ---------- router ----------

export const handleRequest = (deps: Deps, req: Request) =>
  Effect.gen(function* () {
    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const method = req.method.toUpperCase();

    if (path === "/" || path === "/health") return json({ ok: true, at: now() });

    if (path === "/telegram" && method === "POST") {
      const secret = deps.settings.webhookSecret;
      if (Option.isSome(secret) && req.headers.get("x-telegram-bot-api-secret-token") !== Redacted.value(secret.value))
        return text("forbidden", 403);
      const update = yield* readJson(req).pipe(Effect.catch(() => Effect.succeed({} as Json)));
      yield* deps.waitUntil(handleUpdate(deps, update).pipe(Effect.catchCause((c) => Effect.logError("update failed", { cause: String(c) }))));
      return text("ok");
    }

    if (path.startsWith("/api/admin/")) {
      if (!authorized(req, deps.settings.adminToken)) return text("unauthorized", 401);
      if (path === "/api/admin/stats" && method === "GET") return json(yield* adminStats(deps));
      if (path === "/api/admin/ingest" && method === "POST") {
        const keyword = url.searchParams.get("keyword") ?? "Fullstack";
        return json(yield* ingestDjinniKeyword(deps, keyword));
      }
      if (path === "/api/admin/tick" && method === "POST") {
        yield* runTick(deps, Date.now());
        return json({ ok: true });
      }
      if (path === "/api/admin/seed" && method === "POST") return json(yield* seed(deps, yield* readJson(req)));
      if (path === "/api/admin/resume-files" && method === "POST") {
        const body = yield* readJson(req);
        const variant = String(body.variant ?? "");
        const fileId = String(body.fileId ?? "");
        if (!variant || !fileId) return json({ ok: false, error: "variant and fileId required" }, 400);
        yield* deps.kv.put(`tg:file:${variant}`, fileId);
        return json({ ok: true });
      }
      if (path === "/api/admin/summary" && method === "POST") {
        yield* dailySummary(deps);
        return json({ ok: true });
      }
      if (path === "/api/admin/notify" && method === "POST") {
        const body = yield* readJson(req);
        yield* deps.telegram.send(escapeHtml(String(body.text ?? "ping")));
        return json({ ok: true });
      }
      return text("not found", 404);
    }

    if (path.startsWith("/api/")) {
      if (!authorized(req, deps.settings.routineToken)) return text("unauthorized", 401);
      if (path === "/api/queue" && method === "GET") return json(yield* queuePayload(deps));
      if (path === "/api/drafts" && method === "POST") return json(yield* acceptDraft(deps, yield* readJson(req)));
      if (path === "/api/runs" && method === "POST") {
        const body = yield* readJson(req);
        const runId = body.runId ? String(body.runId) : null;
        if (runId) yield* deps.repo.finishRun(runId, true, { ...body, ip: clientIp(req) });
        return json({ ok: true });
      }
      return text("not found", 404);
    }

    return text("not found", 404);
  }).pipe(
    Effect.catchCause((cause) =>
      Effect.logError("request failed", { cause: String(cause) }).pipe(Effect.as(json({ ok: false, error: "internal" }, 500))),
    ),
  );
