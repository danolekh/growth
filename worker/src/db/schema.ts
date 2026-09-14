/**
 * The hunt's state, as Drizzle tables on D1 (SQLite).
 *
 * One row per job seen (`jobs`), one score per job, drafts the routine produced, the ledger of
 * what Dan actually sent (`applications`), the people who wrote back (`contacts`, `messages`),
 * and an append-only `events` log so the funnel can be reconstructed later.
 *
 * Timestamps are ISO strings, not integers: D1 has no date type, SQLite compares ISO strings
 * correctly, and they read back without conversion in the dashboard and the summaries.
 */
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const jobs = sqliteTable(
  "jobs",
  {
    /** `<source>:<external_id>`, e.g. `djinni:848006`. */
    id: text("id").primaryKey(),
    source: text("source").notNull(), // djinni | upwork | linkedin | hn | effect | discord
    externalId: text("external_id").notNull(),
    url: text("url").notNull().unique(),
    title: text("title").notNull(),
    company: text("company"),
    description: text("description").notNull(),
    postedAt: text("posted_at"),
    firstSeenAt: text("first_seen_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    /** JSON array of the RSS lanes that surfaced it. */
    keywords: text("keywords").notNull().default("[]"),
    /** JSON array of flag strings from the deterministic filters. */
    flags: text("flags").notNull().default("[]"),
    filterReason: text("filter_reason"),
    hot: integer("hot").notNull().default(0),
    /** new | enriched | scored | drafting | drafted | applied | skipped | expired */
    status: text("status").notNull().default("new"),
    /** JSON: salary, years_required, work_format, countries, english, employment, domain, company_type, views, applications, detail_error */
    detail: text("detail"),
    /** Telegram message id of the job card, so a later draft can edit it in place. */
    tgMessageId: integer("tg_message_id"),
  },
  (t) => [index("jobs_status_idx").on(t.status), index("jobs_source_idx").on(t.source)],
);

export const scores = sqliteTable("scores", {
  jobId: text("job_id").primaryKey(),
  skillsFit: integer("skills_fit"),
  winnability: integer("winnability"),
  stackability: integer("stackability"),
  signal: integer("signal"),
  total: integer("total"),
  /** apply | apply-low | skip | unscored */
  verdict: text("verdict").notNull().default("unscored"),
  language: text("language"), // en | uk
  summary: text("summary"),
  model: text("model"),
  attempts: integer("attempts").notNull().default(0),
  raw: text("raw"),
  scoredAt: text("scored_at"),
});

export const drafts = sqliteTable(
  "drafts",
  {
    id: text("id").primaryKey(),
    jobId: text("job_id"),
    /** application | reply | upwork-proposal | linkedin-note | skip */
    kind: text("kind").notNull(),
    version: integer("version").notNull().default(1),
    message: text("message").notNull(),
    language: text("language"),
    salaryAsk: text("salary_ask"),
    resumeVariant: text("resume_variant"),
    formNotes: text("form_notes"),
    repoPath: text("repo_path"),
    runId: text("run_id"),
    /** Telegram message id of the card, so taps can edit it. */
    tgMessageId: integer("tg_message_id"),
    /** pending → carded → approved → sent | skipped; carded → later → carded (morning summary) */
    status: text("status").notNull().default("pending"),
    /** For replies: the inbound message this answers. */
    messageId: text("message_id"),
    /** JSON string[]: recruiter screening questions (fetched with the session cookie, or pasted). */
    questions: text("questions"),
    /** JSON [{question, answer}] written by the routine. */
    answers: text("answers"),
    /** Discord only: the public thread reply to use when the poster's DMs are closed. */
    threadReply: text("thread_reply"),
    createdAt: text("created_at").notNull(),
  },
  (t) => [index("drafts_status_idx").on(t.status), index("drafts_job_idx").on(t.jobId)],
);

/** The ledger: one row per application Dan actually sent. */
export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  jobId: text("job_id"),
  draftId: text("draft_id"),
  sentAt: text("sent_at").notNull(),
  salaryAsked: text("salary_asked"),
  appsAtSend: integer("apps_at_send"),
  resumeVariant: text("resume_variant"),
  language: text("language"),
  /** sent | viewed | replied | call | test | offer | hired | rejected | silent */
  stage: text("stage").notNull().default("sent"),
  stageAt: text("stage_at").notNull(),
  notes: text("notes"),
});

export const contacts = sqliteTable("contacts", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  name: text("name"),
  company: text("company"),
  jobId: text("job_id"),
  channel: text("channel"), // email | djinni | upwork | linkedin
  firstSeenAt: text("first_seen_at").notNull(),
  lastSeenAt: text("last_seen_at").notNull(),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  contactId: text("contact_id"),
  jobId: text("job_id"),
  direction: text("direction").notNull(), // in | out
  channel: text("channel").notNull(), // email | djinni | upwork | linkedin
  subject: text("subject"),
  bodyText: text("body_text"),
  /** RFC 5322 Message-ID, so a forwarded copy is not stored twice. */
  messageId: text("message_id").unique(),
  receivedAt: text("received_at").notNull(),
  draftId: text("draft_id"),
});

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobId: text("job_id"),
  draftId: text("draft_id"),
  /** card | apply | skip | later | sent | not_sent | fire | reply_in | email | stage */
  kind: text("kind").notNull(),
  payload: text("payload"),
  at: text("at").notNull(),
});

export const runs = sqliteTable("runs", {
  id: text("id").primaryKey(),
  /** tick | routine | fire | email */
  kind: text("kind").notNull(),
  startedAt: text("started_at").notNull(),
  finishedAt: text("finished_at"),
  ok: integer("ok"),
  stats: text("stats"),
  ip: text("ip"),
});
