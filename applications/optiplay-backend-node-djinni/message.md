# Djinni application — OptiPlay

English post, product company, no Ukrainian signal, so English.

## Message (send this)

Hi! On a live iGaming platform I shipped, resilience was the whole job: idempotent withdrawals
keyed on the ledger index, single-statement bonus expiry with debit, abuse limits on bonus
issuance, retries and error mapping around wallet and gateway calls. That's the same shape as the
integration layer you're describing.

The platform was six Node microservices - identity, gateway, wallet, bonus, casino, notification -
built in Express with Drizzle ORM, PostgreSQL and Redis, Docker and GitLab CI. I owned a GEO
access-rules feature end to end there: schema, the shared decision function, gateway counters,
monitoring alerts on threshold crossings, admin CRUD and the React admin UI. Redis handled
counters, rate limits and alert dedupe. Auth hardening included strict rate limits on login and
session-revocation events consumed downstream by the gateway, so event-driven design between
services is daily work for me.

A few honest gaps. I haven't built on RabbitMQ or Kafka specifically, my event-driven work has
been direct service calls and webhook-style events, not a broker. I don't run Kubernetes, Docker
is where I've deployed. My integration testing has been Vitest plus CI type and lint gates, not
formal contract or load-testing tooling. And I have no game-math or slot-mechanics experience,
that part of the role would be new to me.

I'm based in Vienna, EU time zone, three years commercial TypeScript and Node.

Portfolio: danolekh.com · GitHub: github.com/danolekh

## Form settings
- **Salary expectations:** $2,000. No band shown ($$$ only), product company across Europe/Ukraine
  with business trips and team meetups - reads well-funded, so use the EU/product-company default
  rather than the Ukrainian-company default.
- **CV:** `me/resume/out/Resume-backend.pdf`
- **Timing:** 454 applications on a post from 17 Aug - heavy and not fresh, but the domain match
  (iGaming wallet/bonus/gateway integrations) is rare enough to send anyway. Send today, don't wait
  for a fresher post to justify it.
