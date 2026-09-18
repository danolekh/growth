# Reap — Senior Software Engineer, Card Solutions (Backend-Focused, NodeJS/TypeScript)

- **Source:** cryptojobslist.com · https://cryptojobslist.com/jobs/senior-software-engineer-card-solutions-fully-remote-at-reap
- **Published/views/applications:** unknown (feed post, no detail page)
- **Company:** Reap — card platform (transactions, fraud detection, card lifecycle, developer APIs)
  for clients/partners globally.
- **Format:** Fully Remote · full time
- **Salary:** not stated
- **Years required:** not stated as a number; "Senior" in the title implies a bar

## Raw post (abridged)
Build the foundation of Reap's card platform: design/develop/operate services powering card
transactions, fraud detection, card lifecycle management, developer-facing APIs. High-ownership,
cross-functional (product, design, compliance, engineers). Transaction workflows, scalable
event-driven services, core infra for clients/partners/developers. Wants engineers who care about
system correctness and resiliency in fast-moving teams.

## Requirements → Dan
| They want | Dan |
|---|---|
| NodeJS/TypeScript backend | **Yes**, daily (Express + Drizzle in production) |
| Event-driven services | **Yes** — six microservices on a live iGaming platform, domain events |
| Transaction correctness / resiliency | **Yes** — idempotent withdrawals keyed on the ledger index, single-statement bonus expiry with debit |
| Fraud/risk-style limits | **Partial** — abuse limits on bonus issuance, per-brand GEO rules |
| Developer-facing APIs | **Yes** — REST APIs across every build |
| "Senior" bar (years unstated) | **Stretch** — 3 years, named plainly |

## Stack-ability
Fully remote, no stated team size, backend-focused (matches Dan's strongest recent proof). The
money-correctness work on the iGaming platform (idempotent withdrawals, ledger-indexed operations,
bonus expiry) maps almost one to one onto "card transactions + correctness + resiliency."

## Verdict
**Apply.** Score 19 in the queue. Best angle of the batch: the iGaming wallet/ledger work is close
to a direct match for card-transaction correctness work. Lead with that, past tense, company
unnamed; name the "senior" years gap in one line; the escrow project is a secondary EVM-context
mention, not the hook here since the role isn't EVM-specific.
