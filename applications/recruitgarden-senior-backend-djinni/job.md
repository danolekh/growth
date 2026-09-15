# RecruitGarden — Senior Backend Engineer (Boosters, promotional features)

- **Source:** Djinni.co · https://djinni.co/jobs/848293-senior-backend-engineer-boosters/
- **Published:** 15 Sep 2026 · 2 views · **0 applications** (as of draft time)
- **Company:** RecruitGarden. Reads as a recruiting/staffing brand placing for a gambling-platform
  client rather than the end product company itself; domain flagged "Gambling", type "Product".
  No usable company site found in a quick check.
- **Salary:** $$$$ band, no numbers visible, form prefill unknown.
- **Format:** Full Remote · Europe or Ukraine · Fulltime · English B2
- **Years required:** 5 (Dan: 3, stretch)

## Raw post (abridged)
Senior Backend Engineer for the promotional features team, developing and optimizing promo
features for gaming platforms. PoC-first, deep ownership. Responsibilities: robust backend
systems for promotional features, performance/scalability optimization, technical leadership,
distributed-team collaboration, code/architecture reviews, on-call rotation.

Mandatory: strong Node.js + TypeScript (primary stack), open to other backend ecosystems too;
strong async/concurrency; distributed systems with messaging/coordination (Kafka, RabbitMQ, NATS,
distributed locks); gRPC in production; relational (MySQL, Postgres), columnar (ClickHouse), NoSQL
(DynamoDB, MongoDB); cloud (AWS/GCP/Azure) + Kubernetes; unit/e2e testing; production track
record; large-scale microservices; CS degree or equivalent.

Nice: enterprise patterns, large-scale microservices (repeated), cloud providers, active
performance observation, **gambling domain experience**, appsec/standards awareness.

## Requirements → Dan
| They want | Dan |
|---|---|
| Node.js + TypeScript primary stack | **Yes**, daily |
| Async/concurrency patterns | **Yes**, event-driven services, idempotency keys, rate limits |
| Distributed messaging (Kafka/RabbitMQ/NATS, distributed locks) | **Partial**: domain events between services, idempotent withdrawals keyed on the ledger index; no Kafka/RabbitMQ/NATS by name |
| gRPC in production | **Gap** |
| Relational DBs (MySQL/Postgres) | **Yes**, Postgres daily via Drizzle |
| Columnar (ClickHouse) | **Gap** |
| NoSQL (DynamoDB/MongoDB) | **Gap** |
| Cloud (AWS/GCP/Azure) | **Partial**: AWS at Quextro (S3-style storage, observability); no GCP/Azure |
| Kubernetes | **Gap**, Docker yes, orchestration no |
| Unit/e2e testing | **Yes**, Vitest + Testing Library |
| Production-ready track record | **Yes** |
| Large-scale microservices | **Partial**: 6-service event-driven iGaming platform, not at declared "large-scale" |
| CS degree | **In progress**, BSc CS expected 2026 |
| 5 years | **No**, 3 |
| Gambling domain (nice) | **Yes** — this is the actual angle |

## Stack-ability
Fulltime with on-call rotation, distributed team, senior title. Not the low-touch/async shape the
income plan prefers, and the infra list (gRPC, Kafka-class messaging, Kubernetes, ClickHouse,
DynamoDB) is real distance from Dan's stack. Core language match (Node/TS) and Postgres are solid.

## Verdict
**Apply-low** (score 13). Cheap to send, no hope invested. The one strong, specific angle is that
Dan's most recent contract work was exactly this: bonus/promo systems on a live iGaming platform
(bonus expiry, abuse limits on bonus issuance, campaign dry-run calculations, GEO access rules).
Everything else on the mandatory list beyond Node/TS/Postgres (gRPC, Kafka/RabbitMQ/NATS,
Kubernetes, ClickHouse, DynamoDB, 5 years) is a named gap. Send it for the domain-match odds, name
the infra gaps plainly, don't oversell.
