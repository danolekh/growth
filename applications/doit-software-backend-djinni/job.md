# DOIT Software — Junior-Middle Backend Developer (Node.js, LLM/RAG, MCP, AI agents)

- **Source:** Djinni.co · https://djinni.co/jobs/849808-junior-middle-backend-developer-node-js-llm-r/
- **Published:** 23 Sep 2026 · 15 views · **2 applications** (as of draft time, same day)
- **Company:** DOIT Software. Post describes a fast-growing start-up building a product for
  automated lead generation and recruitment outreach — full B2B, long-term, ASAP start. Company
  site fetch was blocked in this environment; going on the post text only.
- **Format:** Full Remote · Ukraine-based B2B contract · Full-time, long-term · English B2+
- **Salary:** no numeric band shown (Djinni lists only the lowest `$` tier icon). Form prefill
  unknown.
- **Years required:** 1-3 (Dan: 3, comfortable fit); 1+ year in a product company/startup required.

## Raw post (abridged)
Junior-Middle Backend Developer for a start-up's automated lead-generation and recruitment
outreach product. Day-to-day product implementation, AI integrations (Perplexity, OpenAI) and
3rd-party API/CRM integrations, prompt engineering, customer discovery and some client calls.
Requirements: 1+ year in a product company/startup, 1-3 years dev experience, Node.js, TypeScript,
JSON, REST API, Git, LLM/RAG, MCP and AI agent development, SQL database design and optimization,
cloud (AWS/GCP/Azure), async task processing (RabbitMQ, SQS or similar), n8n/make a plus, English
B2+, flexible with shifting priorities. Process: recruiter pre-screen, client call, technical
deep-dive with live coding.

## Requirements → Dan
| They want | Dan |
|---|---|
| 1+ yr in a product company/startup | **Yes** — Quextro (founding engineer, solo) and Renewator (live product) |
| 1-3 yrs dev experience | **Yes**, ~3 years commercial |
| Node.js, TypeScript, JSON, REST API, Git | **Yes** |
| LLM/RAG, MCP, AI agent dev, prompt engineering | **Partial**: built the core LLM pipeline at Quextro (prompt design + structured extraction of questions/topics from PDF exam papers, shipped to real users) — that's applied prompt engineering, not a vector-search RAG stack; no MCP server built, though he's a daily power user of MCP-based tooling (Claude Code) from the client side |
| SQL database design/optimization | **Yes** — Postgres + Drizzle, schema design across every recent project |
| Cloud (AWS/GCP/Azure) | **Partial** — AWS + Railway at Quextro (CI/CD, Docker, OpenTelemetry); no GCP or Azure |
| Async task processing (RabbitMQ/SQS) | **Gap** — event-driven domain events between microservices and Redis for counters/rate limits at Renewator, not a dedicated queue like RabbitMQ/SQS |
| n8n/make | **Gap** |
| English B2+ | **Yes** |

## Stack-ability
Post says full-time and long-term explicitly, which is a real tension with the ~10h/week Renewator
engagement — this reads more like a replacement than a stack, or would need an honest conversation
about hours if it gets to a call. Small, fast-growing team; AI-forward tooling (Cursor Agent mode)
fits how Dan already works.

## Verdict
**Apply.** Fresh post (2 applicants, published today) is the best odds of the week per the
watcher's own rubric. Core stack (Node/TS/Postgres/REST) is a clean match and years required are
in range. The real risk is the LLM/RAG/MCP emphasis — name the Quextro pipeline as real but
narrower proof, and the RabbitMQ/SQS and MCP-server gaps plainly. Angle: applied LLM/prompt work
that shipped to real users, solid backend fundamentals, honest about the agent-framework and
queueing gaps.
