# Djinni application — Umbrelly.Cloud (Tokensaver founding engineer)

English only (worldwide post, US/EU customers). Answer both screening questions inside the message
body, since Djinni gives one text field.

## Message (send this)

Hi! You're looking for someone who builds with AI agents every day and has shipped LLM features
that real users depend on. That's been my last two years, so let me answer your two questions
directly and keep the intro short.

Quick background first. I'm a full-stack TypeScript developer based in Vienna, about three years
commercial. I built Quextro, an ed-tech platform, solo as founding engineer: Node and Bun with
Postgres on the back, React and TanStack on the front, and at its core an LLM pipeline that turns
PDF exam papers into structured questions and topics. British teachers and students use it today.
Right now I build Node microservices for an iGaming platform: a gateway with rate limits and
session revocation, a wallet with idempotent operations, Redis counters and alerts. That is the
same plumbing a router needs, just for money instead of tokens.

1) How I use AI tools. Claude Code is my main tool, daily for over a year. The workflow is: ask it
to read the code and write a plan, I edit the plan, then it implements in small diffs that I read
before committing. I don't merge what I can't explain. Where it pays off most: getting oriented in
a codebase I didn't write (I joined six microservices last month and was shipping in the first
week), migrations and refactors, and tests. I use MCP servers inside that workflow for the tools
around the code, like our issue tracker. On the product side, Quextro's extraction pipeline taught
me the unglamorous parts: input you don't control, Zod-validated output, retries and fallbacks when
the model quietly returns something wrong, and cost per document as a metric I watched every week.

2) How I'd build the router. Start with the contract, not the cleverness: an OpenAI- and
Anthropic-compatible endpoint so a customer switches by changing a base URL and a key. Then a
policy layer per request: which models are allowed, budget and latency limits, and a task class
(short answer, extraction, long reasoning, code). Routing picks the cheapest model that clears the
quality bar for that class, with fallback on errors, rate limits and timeouts. Caching in two
tiers: exact-match on normalized request, then semantic cache for near-duplicates, both with TTLs
the customer controls. Every request logs model, tokens, latency, cost and cache outcome into a
columnar store so the savings dashboard is real numbers, not estimates. The quality bar comes from
a small eval set per customer, run on a schedule, so the router downgrades models only where the
evals say it's safe. Ship the gateway plus exact cache plus fallbacks first, because that alone
cuts bills and builds trust; add semantic cache and learned routing once there's traffic to learn
from.

Two honest gaps. I haven't used ClickHouse; my analytics and caching experience is Postgres and
Redis, and I'd expect ClickHouse to be a short ramp given what it's for here. And I don't write Go
or Rust beyond reading them. Everything else on your list, Node, TypeScript, Next.js, Postgres,
LLM APIs and structured outputs, is daily work.

I'm in Vienna, EU time zone, and I'd genuinely like to build this. Happy to do a test task or
sketch the architecture in more detail on a call.

Portfolio: danolekh.com · GitHub: github.com/danolekh

## Form settings
- **Salary expectations:** $2,500. Founding role, equity on top, $$$ band. Above the $2,000 default
  for product companies, below anything that reads as a senior ask.
- **CV:** `me/resume/out/Resume-fullstack.pdf`
- **Before sending:** confirm the MCP line (integrating MCP servers in your workflow). If you've
  built one, say so instead; if you've only used them via Claude Code, keep the line as is.
- **Timing:** 38 applications on a two-day-old post. Send in the morning.
