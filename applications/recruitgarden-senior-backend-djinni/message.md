# Djinni application — RecruitGarden (Senior Backend Engineer, promotional features)

English post, English message.

## Message (send this)

Promotional features for gaming platforms is close to home for me. On a live iGaming platform I
shipped this year, I built the bonus system end to end: single-statement bonus expiry with debit,
abuse limits on bonus issuance, and campaign dry-run calculations with per-user exclusion reasons.
Same domain, same kind of feature.

My day to day backend is Node.js and TypeScript on Express, with Drizzle, Postgres and Redis
across six event-driven microservices (identity, gateway, wallet, bonus, casino, notification),
all in Docker with GitLab CI. I also built per-brand GEO access rules across that stack, from the
schema to the gateway counters to the monitoring alerts. The services talk through domain events
and idempotency keys, and I shipped session-revocation events the gateway consumes on password
change, so async coordination between services is real work for me, though my event bus there is
simpler than Kafka or NATS and I haven't used gRPC.

Being upfront about the rest of the list, because it matters more than padding this out. I'm at
three years commercial, not five. My databases are Postgres and Redis in production, I haven't
touched ClickHouse, DynamoDB or Mongo. I haven't run Kubernetes, Docker and GitLab CI cover my
deploys instead. If the scale and on-call bar here needs someone already past that, better to know
now than in week one.

Happy to walk through the bonus and wallet work in more detail if it's useful.

Portfolio: danolekh.com

## Form settings
- **Salary expectations:** $2,000. No visible band, product company, full remote across Europe -
  treating it as an EU/international product company, not a Ukrainian-rate post.
- **CV:** `me/resume/out/Resume-backend.pdf`
- **Timing:** posted today (15 Sep), 2 views, 0 applications. Send now, this is as fresh as it gets.
