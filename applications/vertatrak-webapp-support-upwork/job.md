# VertaTrak — Full-Stack Support & Features (Developer Handoff)

- **Source:** Upwork · https://www.upwork.com/jobs/~022102093126206583506
- **Posted:** 22 Sep 2026. Views/applications at draft time: unknown (`detail_error: email-only`,
  scored on the queue summary only).
- **Company:** unnamed on Upwork. Product is **VertaTrak** (public-facing name; the repo and some
  routes still say "MaxTracker"), a mobile-first patient exercise-plan PWA for physical-therapy
  practices - patient plans, streaks/leaderboards, practice/client management, PWA install, opt-in
  push reminders. The handoff doc names the buyer "Paul."
- **Budget:** Hourly, "less than 1 month" posted length (likely a trial before more work). No rate
  shown in the queue data.
- **Format:** Remote. English.

## Raw post (abridged)
A detailed developer-handoff document rather than a normal ad: repo map, current stack, verified
local build/test state (typecheck, streak and achievement test scripts, and the production build
all passing; a non-blocking 559 kB main bundle warning to watch), and a list of domain rules the
next developer must respect - a completed day counts all prescribed exercise instances, not a raw
checkbox count; streaks and lifetime totals derive from canonical daily completion history, never
a cached client field; daily keys use the patient's local date, not UTC, and a long-lived PWA must
refresh on focus and after local midnight; historical completion stays evaluated under the plan
that was live at the time; achievement awards need a durable, idempotent server-side ledger with a
unique constraint on (client_id, milestone_id), and the UI celebration fires only after both the
completion write and the award insert succeed. The current multi-practice/multi-location branch is
draft-only and must not touch production without an explicit activation decision, a safe migration
plan and proven tenant-isolation tests.

## Requirements -> Dan
| They want | Dan |
|---|---|
| React, TypeScript, Vite, Tailwind | **Yes** |
| Vercel serverless API routes | **Yes** |
| Postgres (Neon) with raw SQL migrations | **Partial**: Postgres and schema work daily via Drizzle; comfortable dropping to raw SQL, just not his default |
| Firebase Auth (client + Admin SDK on server paths) | **Gap**: no Firebase Auth; next-auth and OAuth/session work instead |
| Server-side token verification, tenant/practice authorization | **Yes**: matches the per-brand access rules built recently - a shared decision function plus gateway-level checks |
| Idempotent, uniquely-constrained award ledger (client_id, milestone_id) | **Yes, strong**: same shape as idempotent withdrawals keyed on a ledger index and single-statement bonus expiry with debit |
| Canonical-history-derived streaks, local-date keys, no trusting cached client state | **Yes**: same money-correctness instinct - source of truth over cached numbers |
| PWA install/offline app-shell, service workers | **Gap**: no PWA work shipped |
| Capacitor iOS/Android native wrappers | **Gap**: no mobile |
| Firebase Cloud Messaging, idempotent delivery ledger | **Partial**: idempotent delivery/ledger pattern yes; Firebase Messaging specifically no |
| GitHub Actions | **Yes** |

## Stack-ability
Hourly, short posted window, ticket-shaped work on an existing, well-documented codebase - good
low-touch stacking fit next to job1.

## Verdict
**Apply.** The core web stack (React, TypeScript, Vite, Tailwind, Vercel API routes, Postgres) is
a strong match, and the achievement-ledger requirement is almost a direct restatement of the
money-correctness/idempotency work from the iGaming platform contract - the strongest angle here.
Firebase Auth, PWA/offline and Capacitor are real, honest gaps; name them and offer to start on a
small, self-contained ticket (the ledger piece) first.
