# Маркетинг-Партнер — FullStack Developer (React/Next.js + Node.js/GraphQL) / iGaming

- **Source:** Djinni.co · https://djinni.co/jobs/848124-fullstack-developer-react-next-js-node-js-gra/
- **Published:** 14 Sep 2026 · 20 views · **13 applications** (as of draft time)
- **Company:** Маркетинг-Партнер. Ukrainian-named entity hiring for an iGaming product, Cyprus
  ±2h timezone, worldwide remote. No public company site found in a quick check (name reads like
  a staffing/legal entity, common for iGaming postings on Djinni); djinni.co itself is blocked
  from this session's network, so the company profile page couldn't be checked either.
- **Format:** Full Remote · Worldwide · Fulltime · product company · English B1
- **Salary:** $$$$ band (top Djinni tier), but the post text says "за результатами інтерв'ю"
  (negotiated at interview) - no numeric band shown.
- **Years required:** 2 (Dan: 3, comfortable margin)
- **Domain:** Gambling / iGaming

## Raw post (abridged, translated)
FullStack Developer for an iGaming project building a product close to from scratch: a wrapper
platform for many game providers/games, with a modern content and gamification layer. True
fullstack, no "my zone / not my zone" split - the developer works frontend and backend both,
and takes part in architecture and technical decisions.

Work: build frontend from scratch on React/Next.js; build backend on Node.js/TypeScript/GraphQL;
design a microservice architecture meant to serve multiple projects; build and grow a GraphQL
API; work with queues and event-driven interaction between services; design new components and
services; take part in requirements analysis and technical design; make feature decisions
together with Product and Design; write tested, maintainable, scalable code.

Must: React 2+ years, Next.js, TypeScript, React Hooks, Redux/MobX, Webpack, HTML5/CSS3,
Flexbox, styled-components. Node.js + TypeScript 2+ years, practical GraphQL API experience,
understanding of microservice architecture, experience with NATS/Kafka or another message
broker, good knowledge of at least one DB (PostgreSQL/MongoDB/Cassandra). Real commercial
experience on both frontend and backend at once is explicitly called out - not "90% frontend,
occasionally wrote a few CRUD endpoints." Independent technical decisions, proactive, English
enough to read/write technical docs.

Nice to have: Jest/Ava, NestJS/Moleculer, Kubernetes, Elasticsearch, Deno, active GitHub.

Offer: 100% remote, Cyprus ±2h, long-term iGaming project, building a product from scratch (not
just maintaining legacy), influence on architecture, a strong self-driven team, comp discussed
individually.

## Requirements → Dan
| They want | Dan |
|---|---|
| React 2+ years, Next.js, TS | **Yes** |
| React Hooks | **Yes** |
| Redux/MobX | **Gap**: uses Zustand, not Redux/MobX |
| Webpack | **Gap**: works via Next.js/Vite tooling, doesn't hand-roll Webpack configs |
| styled-components | **Gap**: uses Tailwind, not CSS-in-JS |
| Node.js + TS 2+ years | **Yes** |
| Practical GraphQL API experience | **Gap**: REST is his daily API style, no commercial GraphQL |
| Microservice architecture understanding | **Yes**: ships across six Node microservices right now (Renewator, iGaming) |
| NATS/Kafka or message broker | **Partial**: event-driven domain events between services in production, but not named NATS/Kafka specifically |
| PostgreSQL/MongoDB/Cassandra | **Yes**, PostgreSQL daily |
| Real fullstack (frontend + backend at once, commercially) | **Yes**: exactly Dan's current setup (Node microservices + a React admin UI, same iGaming domain) |
| Tests, maintainable/scalable code | **Yes**: Vitest, CI type/lint checks |
| Proactive, independent technical decisions | **Yes**: solo-shipped Quextro end to end |
| English for docs | **Yes** |
| Active GitHub (nice) | **Yes**: 39 public repos, merged OSS PRs |

## Stack-ability
Domain match is the strongest signal on the whole post: Dan is *already* shipping a production
iGaming platform (Renewator) with the same shape - Node microservices, event-driven, Postgres,
Redis, a React admin UI. Post says "Fulltime" and comp is "discussed individually" with no band,
so this reads as a single primary role, not a stackable low-touch add-on. Worth checking
Renewator's contract for exclusivity wording before Dan goes far with this one (per the income
plan's stacking rules) - flagging it here rather than blocking the draft.

## Verdict
**Apply.** Fresh (published today, 13 applications), years bar is no risk (2 required, Dan has
3), and the iGaming/microservices overlap with his current job is about as close a domain match
as this hunt will produce. The real gaps are GraphQL (none commercially) and the frontend
tooling list (Redux/MobX, Webpack, styled-components - he uses Zustand/Next-Vite/Tailwind
instead). Angle: lead with "I ship this exact shape right now," name the GraphQL and
frontend-tooling gaps plainly, let the microservices/event-driven proof carry the rest.
