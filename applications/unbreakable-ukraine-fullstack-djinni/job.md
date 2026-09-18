# Unbreakable Ukraine Foundation — Full-Stack Developer (PostgreSQL, integrations, n8n)

- **Source:** Djinni.co · https://djinni.co/jobs/849078-full-stack-developer-postgresql-integratsiyi-/
- **Published:** 18 Sep 2026 · 2 views · **2 applications** (as of draft time) — the freshest post seen
  this run, marked `hot`.
- **Company:** Unbreakable Ukraine Foundation (nezlamna.org), a charitable foundation running
  Ukrainian-language schools for children displaced to Poland (Warsaw, Wrocław, Kraków), backed by
  UNICEF and Save the Children. Company type: Product · Domain: Education.
- **Salary:** shown as lowest Djinni tier ($), no number visible. Form prefill unknown.
- **Format:** Full Remote · Fulltime · Europe or Ukraine · English required C1 (unusual for an
  otherwise Ukrainian-language post — likely for donor/reporting-facing work).
- **Years required:** 1 (Dan: 3, no filter risk)

## Raw post (abridged)
Building and maintaining centralized data and automation infrastructure. Core focus: PostgreSQL,
n8n, REST APIs and custom backend logic — an engineering approach, not just wiring up workflow
blocks: design the data structure, write code, understand the APIs, keep things reliable.
Responsibilities: design and evolve PostgreSQL (schema, relations, indexes, access rights,
migrations); migrate data from Airtable and other services into a centralized DB; build and
maintain n8n automations including custom JavaScript logic; build integrations via REST API and
webhooks (auth, pagination, rate limits); build small backend services/APIs on FastAPI/Node.js
when needed; error handling, logging, monitoring, workflow stability; document decisions, work
with internal stakeholders and DevOps. Expected: practical PostgreSQL/SQL, relational DB design,
REST API/integration experience, JS/TS or Python, business-process automation experience, Git,
Docker, basic CI/CD, ability to work independently from documentation. Plus: n8n, FastAPI,
Node.js, self-hosted setups, Redis/message queues, monitoring, data migration.

## Requirements → Dan
| They want | Dan |
|---|---|
| PostgreSQL design: schema, relations, indexes, access, migrations | **Yes** — Postgres + Drizzle daily, hand-rolled schemas and migrations |
| Migrate data from Airtable/other services into a central DB | **Partial** — no Airtable-specific migration, but has moved data between systems (sportmagaz.com.ua re-platform, WordPress → Astro rebuilds) |
| n8n automations incl. custom JS | **Gap** — no n8n experience; name it plainly |
| REST API/webhook integrations (auth, pagination, rate limits) | **Yes** |
| Small backend services on FastAPI/Node.js | **Partial** — Node.js/Express yes, daily; FastAPI is Python, not his toolchain |
| Error handling, logging, monitoring, workflow stability | **Yes** — OpenTelemetry, Redis-backed rate limits and alert dedupe (iGaming platform work) |
| JS/TS or Python | **Yes**, TypeScript primary |
| Git, Docker, CI/CD | **Yes** |
| Business-process automation experience | **Partial** — automation-adjacent work (campaign dry-runs, bonus-expiry jobs) but not a workflow-tool background |
| Self-hosted, Redis/queues, monitoring (nice) | **Partial** — Redis in production, no self-hosted infra ownership |
| C1 English | **Yes** |

## Stack-ability
Fresh post (2 views, 2 applications, published today), 1-year bar, full remote. Foundation/NGO
context suggests a small, lean team. Main risk is the salary tier ($) and the n8n gap being a core
duty rather than a nice-to-have.

## Verdict
**Apply.** Core backend stack (Postgres, TS/Node, REST APIs, Docker) is a strong match and the post
is the freshest of the week. The n8n gap is real and stated plainly rather than glossed over — the
post's own framing ("an engineering approach, not just wiring blocks") plays to Dan's strength of
designing the schema and logic underneath, which matters more than n8n familiarity itself.
