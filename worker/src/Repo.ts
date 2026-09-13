/**
 * The repository: every query the Worker runs, as one service over the Effect-flavoured Drizzle
 * client Alchemy hands us for D1. Chunked writes respect D1's 100-bound-parameter limit;
 * conditional updates use `meta.changes` as the mutex, since KV has no compare-and-swap.
 */
import { and, count, desc, eq, inArray, isNull, lt, sql } from "drizzle-orm";
import type { EffectSQLiteD1Database } from "drizzle-orm/effect-d1";
import { Context, Effect, Layer } from "effect";

import { Drizzle } from "./Bindings.ts";
import { applications, contacts, drafts, events, jobs, messages, runs, scores } from "./db/schema.ts";

export type Db = EffectSQLiteD1Database;

export type JobRow = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type ScoreRow = typeof scores.$inferSelect;
export type DraftRow = typeof drafts.$inferSelect;
export type NewDraft = typeof drafts.$inferInsert;
export type ApplicationRow = typeof applications.$inferSelect;
export type MessageRow = typeof messages.$inferSelect;

export const now = () => new Date().toISOString();
export const newId = () => crypto.randomUUID();

const chunk = <T>(xs: readonly T[], size: number): T[][] => {
  const out: T[][] = [];
  for (let i = 0; i < xs.length; i += size) out.push(xs.slice(i, i + size));
  return out;
};

const changes = (res: unknown): number => Number((res as any)?.meta?.changes ?? (res as any)?.changes ?? 0);

const makeRepo = (db: Db) => {
  const insertJobs = (rows: NewJob[]) =>
    Effect.forEach(chunk(rows, 5), (c) => db.insert(jobs).values(c).onConflictDoNothing(), { discard: true });

  const existingJobIds = (ids: string[]) =>
    Effect.forEach(chunk(ids, 90), (c) => db.select({ id: jobs.id }).from(jobs).where(inArray(jobs.id, c))).pipe(
      Effect.map((groups) => new Set(groups.flat().map((r) => r.id))),
    );

  const jobsByStatus = (status: string, limit: number, source?: string) =>
    db
      .select()
      .from(jobs)
      .where(source ? and(eq(jobs.status, status), eq(jobs.source, source)) : eq(jobs.status, status))
      .orderBy(desc(jobs.hot), desc(jobs.firstSeenAt))
      .limit(limit);

  const jobById = (id: string) =>
    db
      .select()
      .from(jobs)
      .where(eq(jobs.id, id))
      .limit(1)
      .pipe(Effect.map((rows) => rows[0] ?? null));

  /** Updates only when the row is still in `expectStatus`; returns whether it changed. */
  const updateJob = (id: string, patch: Partial<NewJob>, expectStatus?: string) =>
    db
      .update(jobs)
      .set({ ...patch, updatedAt: now() })
      .where(expectStatus ? and(eq(jobs.id, id), eq(jobs.status, expectStatus)) : eq(jobs.id, id))
      .pipe(Effect.map((res) => changes(res) > 0));

  const upsertScore = (row: typeof scores.$inferInsert) =>
    db
      .insert(scores)
      .values(row)
      .onConflictDoUpdate({ target: scores.jobId, set: { ...row } })
      .pipe(Effect.asVoid);

  const scoreByJob = (jobId: string) =>
    db
      .select()
      .from(scores)
      .where(eq(scores.jobId, jobId))
      .limit(1)
      .pipe(Effect.map((rows) => rows[0] ?? null));

  const bumpScoreAttempts = (jobId: string) =>
    db
      .insert(scores)
      .values({ jobId, attempts: 1, verdict: "unscored" })
      .onConflictDoUpdate({ target: scores.jobId, set: { attempts: sql`${scores.attempts} + 1` } })
      .pipe(Effect.asVoid);

  /** Jobs the routine should draft: scored apply/apply-low with no draft yet, hot first. */
  const queueJobs = (limit: number) =>
    db
      .select({ job: jobs, score: scores })
      .from(jobs)
      .innerJoin(scores, eq(scores.jobId, jobs.id))
      .where(and(eq(jobs.status, "scored"), inArray(scores.verdict, ["apply", "apply-low"])))
      .orderBy(desc(jobs.hot), desc(jobs.firstSeenAt))
      .limit(limit);

  const insertDraft = (row: NewDraft) => db.insert(drafts).values(row).pipe(Effect.asVoid);

  const draftById = (id: string) =>
    db
      .select()
      .from(drafts)
      .where(eq(drafts.id, id))
      .limit(1)
      .pipe(Effect.map((rows) => rows[0] ?? null));

  const draftsByStatus = (status: string, limit: number, kind?: string) =>
    db
      .select()
      .from(drafts)
      .where(kind ? and(eq(drafts.status, status), eq(drafts.kind, kind)) : eq(drafts.status, status))
      .orderBy(desc(drafts.createdAt))
      .limit(limit);

  const updateDraft = (id: string, patch: Partial<NewDraft>, expectStatus?: string) =>
    db
      .update(drafts)
      .set(patch)
      .where(expectStatus ? and(eq(drafts.id, id), eq(drafts.status, expectStatus)) : eq(drafts.id, id))
      .pipe(Effect.map((res) => changes(res) > 0));

  /** Reply drafts Dan asked for, joined with the inbound message. */
  const queueReplies = (limit: number) =>
    db
      .select({ draft: drafts, message: messages, contact: contacts })
      .from(drafts)
      .innerJoin(messages, eq(messages.id, drafts.messageId))
      .leftJoin(contacts, eq(contacts.id, messages.contactId))
      .where(and(eq(drafts.kind, "reply"), eq(drafts.status, "requested")))
      .limit(limit);

  const insertApplication = (row: typeof applications.$inferInsert) =>
    db.insert(applications).values(row).pipe(Effect.asVoid);

  const applicationById = (id: string) =>
    db
      .select()
      .from(applications)
      .where(eq(applications.id, id))
      .limit(1)
      .pipe(Effect.map((rows) => rows[0] ?? null));

  const updateApplication = (id: string, patch: Partial<typeof applications.$inferInsert>) =>
    db.update(applications).set(patch).where(eq(applications.id, id)).pipe(Effect.asVoid);

  const insertEvent = (row: typeof events.$inferInsert) => db.insert(events).values(row).pipe(Effect.asVoid);

  const startRun = (kind: string, ip?: string) => {
    const id = newId();
    return db
      .insert(runs)
      .values({ id, kind, startedAt: now(), ...(ip ? { ip } : {}) })
      .pipe(Effect.as(id));
  };

  const finishRun = (id: string, ok: boolean, stats: unknown) =>
    db
      .update(runs)
      .set({ finishedAt: now(), ok: ok ? 1 : 0, stats: JSON.stringify(stats) })
      .where(eq(runs.id, id))
      .pipe(Effect.asVoid);

  const upsertContact = (row: { email: string | null; name: string | null; company: string | null; channel: string }) =>
    Effect.gen(function* () {
      if (row.email) {
        const existing = yield* db.select().from(contacts).where(eq(contacts.email, row.email)).limit(1);
        const found = existing[0];
        if (found) {
          yield* db.update(contacts).set({ lastSeenAt: now(), name: row.name ?? found.name }).where(eq(contacts.id, found.id));
          return found.id;
        }
      }
      const id = newId();
      yield* db.insert(contacts).values({
        id,
        email: row.email,
        name: row.name,
        company: row.company,
        channel: row.channel,
        firstSeenAt: now(),
        lastSeenAt: now(),
      });
      return id;
    });

  /** Returns the new message id, or null when the Message-ID was already stored. */
  const insertMessage = (row: typeof messages.$inferInsert) =>
    db
      .insert(messages)
      .values(row)
      .onConflictDoNothing()
      .pipe(Effect.map((res) => (changes(res) > 0 ? row.id : null)));

  const messageById = (id: string) =>
    db
      .select()
      .from(messages)
      .where(eq(messages.id, id))
      .limit(1)
      .pipe(Effect.map((rows) => rows[0] ?? null));

  // ---------- housekeeping ----------

  const expireStale = (beforeIso: string) =>
    db
      .update(jobs)
      .set({ status: "expired", updatedAt: now() })
      .where(and(inArray(jobs.status, ["new", "enriched", "scored"]), lt(jobs.firstSeenAt, beforeIso)))
      .pipe(Effect.map(changes));

  const markSilent = (beforeIso: string) =>
    db
      .update(applications)
      .set({ stage: "silent", stageAt: now() })
      .where(and(eq(applications.stage, "sent"), lt(applications.sentAt, beforeIso)))
      .pipe(Effect.map(changes));

  // ---------- stats ----------

  const countWhere = (table: any, cond: any) =>
    db
      .select({ n: count() })
      .from(table)
      .where(cond)
      .pipe(Effect.map((rows) => Number(rows[0]?.n ?? 0)));

  const stats = (sinceIso: string, weekIso: string) =>
    Effect.all({
      newSince: db
        .select({ source: jobs.source, n: count() })
        .from(jobs)
        .where(sql`${jobs.firstSeenAt} >= ${sinceIso}`)
        .groupBy(jobs.source),
      scoredSince: countWhere(jobs, and(eq(jobs.status, "scored"), sql`${jobs.updatedAt} >= ${sinceIso}`)),
      awaitingDraft: countWhere(jobs, eq(jobs.status, "scored")),
      carded: countWhere(drafts, eq(drafts.status, "carded")),
      later: countWhere(drafts, eq(drafts.status, "later")),
      unscored: countWhere(scores, and(eq(scores.verdict, "unscored"), sql`${scores.attempts} >= 3`)),
      sentWeek: countWhere(applications, sql`${applications.sentAt} >= ${weekIso}`),
      replies: countWhere(applications, inArray(applications.stage, ["replied", "call", "test", "offer"])),
      inbound: countWhere(messages, and(eq(messages.direction, "in"), sql`${messages.receivedAt} >= ${sinceIso}`)),
      repliesRequested: countWhere(drafts, and(eq(drafts.kind, "reply"), eq(drafts.status, "requested"))),
    });

  const laterDrafts = (limit: number) => draftsByStatus("later", limit);

  const jobsWithoutCard = (limit: number) =>
    db
      .select({ job: jobs, score: scores })
      .from(jobs)
      .innerJoin(scores, eq(scores.jobId, jobs.id))
      .where(and(eq(jobs.status, "scored"), isNull(jobs.tgMessageId), inArray(scores.verdict, ["apply", "apply-low"])))
      .orderBy(desc(jobs.hot), desc(jobs.firstSeenAt))
      .limit(limit);

  return {
    insertJobs,
    existingJobIds,
    jobsByStatus,
    jobById,
    updateJob,
    upsertScore,
    scoreByJob,
    bumpScoreAttempts,
    queueJobs,
    insertDraft,
    draftById,
    draftsByStatus,
    updateDraft,
    queueReplies,
    insertApplication,
    applicationById,
    updateApplication,
    insertEvent,
    startRun,
    finishRun,
    upsertContact,
    insertMessage,
    messageById,
    expireStale,
    markSilent,
    stats,
    laterDrafts,
    jobsWithoutCard,
  };
};

export type RepoShape = ReturnType<typeof makeRepo>;

export class Repo extends Context.Service<Repo, RepoShape>()("growth/Repo") {
  static readonly layer = Layer.effect(Repo)(Effect.map(Drizzle, (db) => makeRepo(db)));
}
