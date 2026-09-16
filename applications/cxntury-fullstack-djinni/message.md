# Djinni application — CXntury

English post, international/startup company - sending English.

Angle: AI-tool fluency and end-to-end feature ownership up front (matches their "AI-first
engineering culture" framing), the iGaming ledger idempotency work as the closest proof to their
Stripe ask, then Firebase/Google Cloud named as honest gaps.

## Message (send this)

Claude Code is what I use daily on real feature work, and reviewing everything it writes before it
ships is the part I take seriously, not just prompting and merging. That habit plus owning a
feature end to end are the two things your post leads with.

On a live iGaming platform I built six Node.js microservices end to end (identity, gateway,
wallet, bonus, casino, notification) on Express, Drizzle ORM, Postgres and Redis, inside a
multi-dev codebase with code review, not a fresh repo. I owned one feature there myself start to
finish: GEO access rules, schema, the shared decision function, gateway counters, monitoring
alerts, admin CRUD and the React admin UI. The money side of that platform had to be correct every
time: idempotent withdrawals keyed on the ledger index, single-statement bonus expiry with debit,
abuse limits on bonus issuance. Before that I built Quextro, an ed-tech platform, solo from an
empty repo to real users, now used by British teachers and students.

Two things on your list I haven't shipped, and I'd rather say so now. I haven't used Firebase or
Google Cloud in production - my data and cloud experience is Postgres with Drizzle and Supabase,
deployed on AWS, Cloudflare Workers, Railway and Vercel. On Stripe I've done Checkout and webhooks,
not Connect, PaymentIntents or holds and captures, though the idempotency work above is the
closest thing I've built to what that needs. Node, React, TypeScript, owning a feature
independently and maintaining someone else's codebase are all solid ground, and Firebase's model
is close enough to what I already do that I'd expect it to be a short ramp.

Based in Vienna, EU time zone.

Portfolio: danolekh.com · GitHub: github.com/danolekh

## Form settings

- **Salary expectations:** $1,500. Post shows Djinni's lowest "$" salary tier (no numbers), and
  the company reads as an international startup rather than clearly Ukrainian or clearly EU/US
  product - erring toward the lower end given the tier signal rather than the $2,000 EU/US
  default.
- **Resume variant:** `fullstack` (`me/resume/out/Resume-fullstack.pdf`).
- **Timing:** fresh post (16 Sep), 12 applications already. Send today.
