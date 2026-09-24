# Lynx Capital Partners — Senior Backend Engineer (Node.js / TypeScript)

- **Source:** Djinni.co · https://djinni.co/jobs/850183-senior-backend-engineer-node-js-typescript/
- **Published:** 24 September 2026 · 8 views · **1 application** (as of draft time)
- **Company:** Lynx Capital Partners, fintech product company, EU. Real-time market data and
  order-management platform for a brokerage/trading product. Site not chased (no domain in the
  post, not worth the minute).
- **Format:** Full Remote · EU · Fulltime · English C1 · occasional US travel may be needed
- **Salary:** "$$$$" band shown, no explicit number
- **Years required:** 4 in the structured field; the post text asks for 5+ overall, 3+ in Node/TS
  specifically (Dan: 3 total — **stretch**, say it plainly)

## Raw post (abridged)
Market data: ingest vendor feeds, normalize instruments/symbology, fan out to web/mobile over
WebSockets (subscriptions, snapshot+delta, conflation/throttling, slow-consumer handling,
reconnect/resync), enforce entitlements. Order management: integration layer on the clearing
firm's REST/FIX APIs — order gateway (validation, pre-trade checks, idempotent submission), order
state from provider events, positions, realized/unrealized P&L, reconciliation against snapshots
and the ledger. Reliable ingestion of provider webhooks/event streams: signature verification,
dedup, out-of-order handling, gap detection, replay. Auth, session management, account lifecycle,
entitlements, billing hooks. Identify vendor-API gaps and propose fixes; design for graceful
degradation when upstream feeds are down. Requirements: 5+ years backend on distributed
event-driven systems, 3+ in Node/TS including runtime-under-load (event loop, backpressure,
memory/GC, scaling stateful connections); has built and operated a high-fan-out real-time system
and can describe it in numbers (connections, msgs/sec, p99); message ordering, dedup, idempotency,
retries, backpressure, replay, failure recovery; production systems handling financial
transactions, with monitoring/structured logging/tracing/incident investigation; AWS (containers,
IAM, managed messaging/streaming) and Redis, IaC; strong automated testing (unit/integration/e2e);
occasional US travel. Nice to have: brokerage/clearing/custody/market-data integrations, equity and
options order lifecycles, FIX, symbology, exchange connectivity; Postgres/Redis/time-series store;
systems with monetary values, audit trails, reconciliation, regulatory requirements; futures/crypto/
prediction-market platforms.

## Requirements → Dan
| Requirement | Dan |
|---|---|
| 5+ years backend, distributed event-driven systems | **Gap on years** — 3 years commercial total |
| 3+ years Node/TS under load (event loop, backpressure, GC) | **Partial** — event-driven Node microservices in production (Renewator), not at this scale |
| High-fan-out real-time system with numbers to cite | **Gap** — no comparable system built |
| Message ordering, dedup, idempotency, retries, replay | **Partial** — idempotent withdrawals keyed on the ledger index, bonus-expiry single-statement debit, abuse limits |
| Production systems moving real money, monitoring/tracing | **Partial** — wallet/bonus/casino money-correctness work, OpenTelemetry |
| AWS (containers, IAM, messaging), Redis, IaC | **Partial** — AWS at Quextro, Redis (ioredis) in production at Renewator; IaC not claimed |
| Automated testing (unit/integration/e2e) | **Yes** — Vitest + Testing Library |
| FIX, brokerage/clearing, market-data/exchange connectivity | **Gap** — no exposure |
| Occasional US travel | Not a skill gap; not addressed in the message |

## Stack-ability
Product company, EU, but the role is a deep specialist track (real-time market data + order
management for a regulated trading product), not a small-team generalist seat. Heavy meetings and
on-call risk aren't stated but are likely at this depth. Salary band shown only as a symbol, no
number — treat as no visible band.

## Verdict
**Apply, but hedge hard.** The scorer flagged it `senior` + `stretch-years`, and it's right: every
FIX/market-data/brokerage line is a real gap, and years are short by two. What does carry over
honestly is the money-correctness shape of the work (idempotent withdrawals, ledger reconciliation,
event-driven services, Redis, AWS) — same problem family, much smaller scale. Angle: lead with the
ledger/idempotency proof since it's the one specific, verifiable overlap; name the years and the
FIX/market-data gap in one plain paragraph; don't oversell exchange-connectivity language.
