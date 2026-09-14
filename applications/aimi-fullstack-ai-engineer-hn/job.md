# AiMi — Full Stack AI Engineer

- **Source:** Hacker News "Who is hiring" · https://news.ycombinator.com/item?id=49552714
- **Published:** 3 Sep 2026 (HN thread). Views/applications not visible on HN.
- **Company:** AiMi — agentic AI infrastructure for capital markets. Autonomous agents ingest
  venue/vendor notifications, assess impact across client infrastructure, and drive change
  management workflows for exchanges and their ops teams. Live production platform, not a pilot.
  Apply via join.com or directly at vishnu.swaroop@aimi.technology.
- **Format:** Full Remote (Everywhere) · Full-time · early-stage.
- **Salary:** not stated.
- **Years required:** 2-3+ hands-on (Dan: 3, fits).

## Raw post (abridged)
Full-stack across React/TypeScript frontend, Node.js backend, AWS Lambda. Concretely: shipping
features in the agent pipeline, building MCP-based connectors and skills that extend what their
agents can reach, running evals on agent accuracy/reliability, building observability and
alerting for agent latency/error rates/failed workflows, making long-running LLM/agent/SSE calls
resilient (timeouts, retries, circuit breakers, fail-fast, recovery), plus diagnosing
dependency/version conflicts in a Node.js/npm monorepo. Looking for 2-3+ years hands-on, solid
Node.js and REST API background, real hands-on work with LLMs or agent frameworks (Mastra,
LangChain, LlamaIndex, Claude, OpenAI or similar), comfortable with AWS (Lambda, Bedrock,
DynamoDB, S3, Cognito, API Gateway, CloudWatch), MongoDB/DynamoDB, and genuinely tests what you
ship (unit, integration, e2e). Familiarity with spec-driven development (Claude Code, Cursor,
CodeRabbit or similar) is called out as "a real plus since that's how we work day to day." Bonus
for capital markets/trading infra background, LLM observability tooling (Langfuse), SSE
streaming, PostHog. Real architectural decisions from week one, room to grow into senior/lead.

## Requirements → Dan
| They want | Dan |
|---|---|
| React/TypeScript frontend | **Yes** |
| Node.js backend, REST APIs | **Yes**, daily on the iGaming microservices |
| 2-3+ years hands-on | **Yes**, 3 |
| Hands-on LLM work | **Yes**: built the core LLM algorithm at Quextro that extracts questions/topics from PDF exam papers, solo, in production |
| Agent frameworks (Mastra/LangChain/LlamaIndex) | **Gap**: no named agent framework shipped. Closest is the Quextro LLM pipeline plus daily use of Claude Code on real feature work |
| Spec-driven dev (Claude Code, Cursor) | **Strong yes**, this is literally how Dan ships today |
| AWS (Lambda, Bedrock, DynamoDB, Cognito, API Gateway, CloudWatch) | **Partial**: AWS at Quextro, but no Lambda/Bedrock/Cognito specifically; S3/R2-style object storage yes |
| MongoDB/DynamoDB | **Gap**: Postgres/SQLite, not document stores |
| Testing (unit/integration/e2e) | **Yes**: Vitest + Testing Library, CI checks |
| SSE, resilience patterns (retries, circuit breakers) | **Partial**: event-driven services with idempotency and rate limiting at Renewator, no direct SSE work named |
| Capital markets/trading infra | **No** |

## Stack-ability
Reads as a demanding early-stage full-time role, not a low-touch stacked one - agent pipeline
ownership, on-call-style resilience work, "real architectural decisions from week one." Flagged
**hot** by the watcher.

## Verdict
**Apply.** Core stack (React/TS/Node, LLM production work, Claude Code daily) is a real match;
the named agent frameworks and AWS services are the honest gap. Angle: the Quextro LLM pipeline
as proof of hands-on LLM shipping, and daily Claude Code use as almost a direct match to their
"spec-driven development" ask - then name the framework and AWS-service gaps plainly.
