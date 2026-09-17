# Djinni application — Crew Matrix

Ukrainian post → send Ukrainian, English version below.

Angle: the post's headline ask is real, day-to-day agentic-coding practice (CLAUDE.md hierarchy,
skills, a routine). Dan has exactly that, live, in this repo - lead with it instead of restating
the job back. Then the Node/Postgres production work and Next.js build. Then the honest gaps:
NestJS, TypeORM, formal subagent-role separation with hooks, multi-repo worktree orchestration,
custom MCP servers.

## Ukrainian (send this one)

У мене вже є те, що ви описуєте: агентний процес з CLAUDE.md ієрархією, власними skills і окремим
routine, який я сам написав. Він щодня виконує реальну задачу - скоринг вхідних вакансій, драфт
відповідей у моєму голосі, деплой через Cloudflare Worker на Effect і Drizzle. Це не демо, воно
живе в проді.

На бекенді останній контракт - шість Node-мікросервісів для живої iGaming-платформи (Express,
Drizzle, PostgreSQL, Redis, Docker, GitLab CI): ідентифікація, гейтвей, гаманець, бонуси, казино,
нотифікації. Я також відповідав за коректність грошей - ідемпотентні виведення коштів на ключі
леджера, single-statement списання бонусів з дебетом. До того - Next.js 14 e-commerce платформа з
власною адмінкою на 2000+ товарів і рольовим доступом, і Quextro, ed-tech платформа, яку я
збудував соло від порожнього репо до реальних користувачів (Bun, Effect.ts, Drizzle, React 19,
TanStack).

Чесно про прогалини. NestJS я не здавав у продакшн, основний бекенд-фреймворк для мене Express, з
NestJS був дотик як з інструментом на попередній роботі. TypeORM теж не мій щоденний ORM, я весь
час на Drizzle, хоча різниця там переважно в API, а концепції ті самі. Формальний поділ на subagent-ролі
(developer/reviewer/QA) з enforcement через hooks, оркестрація кількох репо через worktrees і
власні MCP-сервери - це рівень, якого в мене поки немає. Я користуюсь Claude Code щодня і
перевіряю все, що він пише, але саме такий процес з нуля я не будував.

Готовий показати той repo з CLAUDE.md і routine наживо, якщо це допоможе.

Портфоліо: danolekh.com · GitHub: github.com/danolekh

## English

I already have what you're describing: an agentic process with a CLAUDE.md hierarchy, custom
skills and a separate routine I wrote myself. Every day it handles a real task, scoring incoming
job posts, drafting replies in my own voice, deploying through a Cloudflare Worker on Effect and
Drizzle. It's not a demo, it runs in production.

On the backend side, my most recent contract was six Node microservices for a live iGaming
platform (Express, Drizzle, PostgreSQL, Redis, Docker, GitLab CI): identity, gateway, wallet,
bonus, casino, notifications. I also owned the money-correctness side, idempotent withdrawals
keyed on the ledger index, single-statement bonus expiry with debit. Before that, a Next.js 14
e-commerce platform with a custom admin panel for 2,000+ products and role-based access, and
Quextro, an ed-tech platform I built solo from an empty repo to real users (Bun, Effect.ts,
Drizzle, React 19, TanStack).

Honest about the gaps. I haven't shipped NestJS in production, Express is my daily Node framework,
NestJS was tooling exposure at a previous job. TypeORM isn't my daily ORM either, I live in
Drizzle, though the difference there is mostly API shape and the concepts carry over. The formal
split into subagent roles (developer/reviewer/QA) with hook-enforced gates, multi-repo
orchestration through worktrees, and custom MCP servers are a level I haven't built yet. I use
Claude Code every day and review everything it writes, but I haven't set up that exact process
from scratch.

Happy to show that CLAUDE.md repo and routine live if it helps.

Portfolio: danolekh.com · GitHub: github.com/danolekh

## Form settings
- **Salary expectations:** $1,500. No visible band, Ukrainian company - default per the income plan.
- **CV:** `me/resume/out/Resume-fullstack.pdf`
- **Timing:** hot, fresh post (36 views, 6 applications, published today). Send now.
