# OptiPlay — Backend Developer (Node.js)

- **Source:** Djinni.co · https://djinni.co/jobs/843432-backend-developer-node-js/
- **Published:** 17 Aug 2026 · 953 views · **454 applications** (as of 15 Sep draft time)
- **Company:** OptiPlay, product company in the gambling/iGaming domain. Builds casino-operator
  and partner-platform integrations (wallet/transaction APIs, game launch, reporting contracts)
  plus a game logic platform for slot titles. Site did not resolve on a quick check; going on the
  post only.
- **Salary:** $$$ band, no number shown.
- **Format:** Full Remote · Europe or Ukraine · Fulltime · English B1
- **Years required:** 3-5+ (Dan: 3, at the line, not a stretch)

## Raw post (abridged)
Middle+/Senior Backend Developer, 70% designing and maintaining external integrations with casino
operators and partner platforms (wallet/transaction APIs, game launch, reporting), 30% general
backend/platform work and system design. Owns the full lifecycle from contract design to
production monitoring. Builds resilient integration layers: retries, idempotency, timeouts, error
mapping, graceful degradation when a third party misbehaves. Contributes to core backend services,
APIs, messaging flows, data models. Also takes part in slot game development on their own game
logic platform (mechanics and mathematics). Defines integration testing practices: contract
testing, mocking/stubs, e2e, stress/load testing. Works with Game Logic, Product and DevOps to keep
integration contracts stable.

Must: 3-5+ years Node.js + TypeScript with ownership of non-trivial systems; proven external
integration design (REST/HTTP, XML/SOAP, RPC, webhook-based); modular service-oriented backend
architecture; message brokers (RabbitMQ or Kafka), event-driven queue-based design; integration
testing (contract, mocking, e2e, stress); PostgreSQL and Redis; CI/CD, Git, monitoring/observability
(Grafana, Loki, Tempo); AWS, Docker, Kubernetes. Nice: iGaming/gambling/RNG integration experience,
ArgoCD/GitOps. Flexible start 08:00-11:00 CET, async-friendly, minimal meetings, direct contact
with founders/C-level.

## Requirements → Dan
| They want | Dan |
|---|---|
| 3-5+ yrs Node.js + TS, ownership of non-trivial systems | **Yes**, 3 years, owned GEO access rules end to end (schema → decision function → gateway → admin UI) on a live platform |
| External integration design (REST/webhook/RPC) | **Partial**: owns internal service-to-service contracts (gateway, wallet, bonus) with retries and idempotency; no third-party casino-operator API integration by name |
| Service-oriented backend architecture | **Yes**, six-service Node platform (identity, gateway, wallet, bonus, casino, notification) |
| Message brokers (RabbitMQ/Kafka), event-driven queues | **Gap on the broker**: event-driven between services (session-revocation events, monitoring alerts), but not built on RabbitMQ or Kafka specifically |
| Integration testing: contract, mocking, e2e, stress/load | **Partial**: Vitest + Testing Library, CI type/lint gates; no formal contract or load-testing tooling |
| PostgreSQL, Redis | **Yes**, both in production daily (Drizzle ORM, ioredis for counters/rate limits/alert dedupe) |
| CI/CD, Git, Grafana/Loki/Tempo | **Partial**: CI/CD and Git daily (GitLab CI), OpenTelemetry from Quextro; not Grafana/Loki/Tempo by name |
| AWS, Docker, Kubernetes | **Partial**: Docker daily, AWS from Quextro; no Kubernetes |
| iGaming/gambling/RNG (nice to have) | **Yes, strong** — recent contract work is exactly this domain |
| Slot game mechanics/mathematics | **Gap**, no game-math experience |

## Stack-ability
Full remote, async-friendly, minimal meetings, flexible 08:00-11:00 CET start, direct founder
contact — reads like a small, low-meeting team. Fulltime, not stated as part-time-friendly, so
check overlap expectations if it moves forward.

## Verdict
**Apply.** The domain match is the strongest part: recent contract work is wallet, bonus, casino
and gateway microservices on the exact stack (Express, Drizzle, Postgres, Redis, Docker, GitLab
CI) with real money-correctness work (idempotent withdrawals, single-statement bonus expiry,
abuse limits) — that maps almost one to one onto "resilient integration layers: retries,
idempotency, timeouts, error mapping". The honest gaps are the specific tooling: no RabbitMQ/Kafka,
no Kubernetes, no formal contract/load testing, no slot math. 454 applications on a post from
17 Aug is heavy, but the domain fit is rare enough to be worth the send. Angle: lead with the
money-correctness and integration-layer proof, name the broker/K8s/testing-tooling gaps plainly in
one paragraph.
