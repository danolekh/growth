# GEOBUYER — Fullstack Developer нового покоління (Node.js / AI Agents / Claude)

- **Source:** Djinni.co · https://djinni.co/jobs/848208-fullstack-developer-novogo-pokolinnia-node-js/
- **Published:** 14 Sep 2026 · 25 views · **8 applications** (as of draft time)
- **Company:** GEOBUYER. Runs several product IT projects, actively moving to an AI-assisted
  development model where Claude/Claude Code agents do real engineering work under a developer's
  control. Couldn't confirm a public site inside a minute; triaging on the post alone.
- **Format:** Full Remote · Ukraine only · product · language not stated (post is Ukrainian)
- **Salary:** $$$ band, no exact number shown.
- **Years required:** 4 (Dan: 3, stretch — say it plainly)

## Raw post (abridged)
Looking for a "next-generation" fullstack developer who treats Claude/Claude Code as a real part
of the engineering team, not just autocomplete: formulate engineering-ticket-level tasks for AI
agents, break big work into stages, delegate to multiple agents, run several in parallel, check
each agent's output, catch AI-generated mistakes, and make the final call. Over time this person
could become an AI Orchestrator / AI Engineering Lead. Work: new features and services on
Node.js/TypeScript backend, React/TypeScript frontend, REST APIs, PostgreSQL, Redis, external API
integrations, architecture decisions. Also legacy-to-Node.js migrations on some projects: analyze
existing architecture, plan the migration, move services incrementally, keep the old and new
systems compatible, test throughout. Explicitly NOT looking for someone who blindly trusts AI —
wants strong fundamentals, architecture understanding, code review skill, security awareness,
testing, debugging, critical thinking.

**Must:** confident Node.js, confident TypeScript, REST API, PostgreSQL/SQL, Redis, async/event
loop, NestJS/Fastify/Express or similar, backend architecture understanding, external API
integration experience; React, TypeScript, JS, HTML/CSS, REST API, component architecture
(Next.js a plus); practical Claude/Claude Code experience, AI-assisted development, prompt/context
engineering, working big tasks through AI, understanding LLM limits, verifying AI output; Git,
Docker, CI/CD, Linux, deployment process understanding (K8s/cloud/GitLab CI a plus).

**Big plus:** AI agents, MCP, agent orchestration, Claude Code workflows, OpenAI/Anthropic API,
function calling/tools, RAG, vector databases, n8n/Make, own AI automation workflows, legacy
migration experience, RabbitMQ/Kafka/BullMQ, Elasticsearch, K8s, startup/product environment.

## Requirements → Dan
| They want | Dan |
|---|---|
| Confident Node.js | **Yes** — production microservices daily |
| Confident TypeScript | **Yes** — primary language |
| REST API | **Yes** |
| PostgreSQL/SQL | **Yes** |
| Redis | **Yes** — ioredis in production: counters, rate limits, alert dedupe |
| Async/event loop | **Yes** |
| NestJS/Fastify/Express or similar | **Partial**: Express is the daily production framework, no NestJS/Fastify commercially |
| Backend architecture understanding | **Yes** |
| External API integration | **Yes** |
| React/TS/JS/HTML/CSS, component architecture | **Yes** |
| Next.js (plus) | **Yes** |
| Practical Claude/Claude Code experience | **Yes** — daily driver on real feature work |
| AI-assisted dev, prompt/context engineering | **Yes** |
| Breaking large tasks into stages for AI | **Yes** — this is literally how Dan builds |
| Understanding LLM limits, verifying AI output | **Yes** |
| AI agents/MCP/orchestration (plus) | **Partial**: runs Claude Code's own subagents/parallel workflows daily, hasn't built a formal multi-agent orchestration system for a client |
| RAG/vector databases (plus) | **Yes** — Quextro's LLM pipeline extracting questions/topics from PDF exam papers |
| n8n/Make (plus) | **No** |
| Git, Docker, CI/CD, Linux | **Yes** |
| K8s/cloud/GitLab CI (plus) | **Partial**: GitLab CI at Renewator, no K8s |
| Legacy migration experience (plus) | **Yes** — GEO rules and other features shipped inside an existing multi-dev codebase; not a full backend-language migration specifically |
| 4 years required | **No**, 3 — stretch |

## Stack-ability
Ukraine-only, product company, fulltime employment. Check for exclusivity wording before signing
(income-plan rule) since "fulltime" language raises that question.

## Verdict
**Apply.** The strongest angle on the whole queue this run: the AI-orchestration description is
close to Dan's actual daily workflow with Claude Code (task breakdown, parallel subagents,
reviewing before accepting), and the Node/TS/Postgres/Redis stack is exactly the Renewator
production stack. Name the 3-vs-4-years gap and the NestJS/formal-orchestration gaps plainly.
