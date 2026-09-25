# Djinni application — Commit Offshore

English (post is in English, no Ukrainian-language cue).

## Message (send this)

Hi! Your post reads like the last few months of my work: Node.js microservices built for a system
that has to stay correct and stay up under real load.

On my last contract I shipped six Express microservices for a live iGaming platform (identity,
gateway, wallet, bonus, casino, notification), backed by Postgres and Redis, with money-correctness
work baked in: idempotent withdrawals keyed on the ledger index, single-statement bonus expiry with
debit, abuse limits on bonus issuance. Auth got hardened too, rate limits on login and session
revocation on password change, consumed by the gateway. All of it ran in Docker with GitLab CI.
Before that I built Quextro, an ed-tech platform, solo from an empty repo to real users now used by
British teachers and students: Bun, Effect.ts, Drizzle and Postgres on the back, Docker, GitHub
Actions and OpenTelemetry around it.

Redis is a tool I use daily, for counters, rate limits and alert dedupe. Testing is Vitest with CI
checks on every push, and conventional commits are just how my history reads.

A few honest gaps. I'm at three years commercial, not the four-plus you're asking for, and the post
reads senior in scope, owning architecture and mentoring juniors, which isn't ground I've covered
yet. I haven't worked with MongoDB, my data layer has been Postgres and Drizzle. I haven't run a
message queue like RabbitMQ or SQS in production, and I haven't touched Kubernetes, Helm or Argo
CD. My AWS experience is Quextro-level, object storage, Postgres, mail sending, not a GCP or a full
infra build.

I'm available now and can start quickly.

Portfolio: danolekh.com · GitHub: github.com/danolekh

## Form settings
- **Salary expectations:** $1,500. $$$$ shown with no number and no confirmed company origin;
  default for an unconfirmed/likely-Ukrainian outstaff company, no band visible.
- **CV:** `me/resume/out/Resume-backend.pdf`
- **Timing:** published today, 0 applications at draft time. Send as soon as possible while it's
  still the newest post in the feed.
