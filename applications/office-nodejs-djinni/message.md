# Djinni application — Office.kh.ua

Ukrainian post, no company description beyond "internal projects" — sending the Ukrainian
version. English translation below for reference.

Angle: the iGaming platform microservices work (Express/Drizzle/Postgres/Redis/Docker/GitLab CI,
money-correctness code) maps closely onto their required stack, plus Quextro for "a voice in
technical decisions." NestJS and GraphQL are named as honest gaps.

## Ukrainian (send this one)

Ваш стек - Node.js, Express, TypeScript, Postgres і мікросервіси - це рівно те, з чим я працював
на останньому проєкті. На iGaming платформі я побудував шість Node.js мікросервісів (identity,
gateway, wallet, bonus, casino, notification) на Express, Drizzle ORM, PostgreSQL і Redis, з
Docker і GitLab CI. Окремо зробив фічу з GEO access rules від і до: схему, спільну функцію
рішення, лічильники на gateway, алерти моніторингу на порогових значеннях, адмінку і React UI до
неї.

Гроші там мали бути правильними завжди, і саме це стояло за "production principles: логування,
обробка помилок, стабільність" з вашого допису: ідемпотентні виплати за ledger-індексом, списання
прострочених бонусів одним запитом з дебетом, ліміти на видачу бонусів проти зловживань.

До цього я соло збудував Quextro, ed-tech платформу, з порожнього репозиторію до реальних
користувачів - нею користуються британські вчителі та учні. Bun, Effect.ts і Drizzle на бекенді,
React 19 і TanStack на фронті, весь CI/CD, Docker і спостережуваність через OpenTelemetry свої.
Усі технічні рішення там ухвалював я сам, тож "участь у прийнятті технічних рішень" це буквально
те, як я звик працювати.

Чесно про прогалини. NestJS не є моїм щоденним фреймворком - є досвід з внутрішніми NestJS/Vue
інструментами на попередньому місці, але основний бекенд-фреймворк у мене це Express. GraphQL я
не використовував, весь мій API-досвід це REST. Базовий AWS і CI/CD є: GitHub Actions, GitLab CI,
AWS на Quextro.

Готовий обговорити деталі і зробити тестове завдання, якщо це буде корисно.

Портфоліо: danolekh.com · GitHub: github.com/danolekh

## English (for reference)

Your stack - Node.js, Express, TypeScript, Postgres and microservices - is exactly what I worked
in on my last project. On a live iGaming platform I built six Node.js microservices (identity,
gateway, wallet, bonus, casino, notification) on Express, Drizzle ORM, PostgreSQL and Redis, with
Docker and GitLab CI. I separately owned a feature end to end there: GEO access rules, schema, the
shared decision function, gateway counters, monitoring alerts on threshold crossings, admin CRUD
and the React admin UI.

The money side of that platform had to be correct every time, which is what your "production
principles: logging, error handling, stability" line is really asking about: idempotent
withdrawals keyed on the ledger index, single-statement bonus expiry with debit, abuse limits on
bonus issuance.

Before that I built Quextro, an ed-tech platform, solo from an empty repo to real users, now used
by British teachers and students. Bun, Effect.ts and Drizzle on the backend, React 19 and TanStack
on the front, all the CI/CD, Docker and OpenTelemetry observability were mine. Every technical
decision there was mine too, so "a voice in technical decisions" is literally how I'm used to
working.

Honest about the gaps. NestJS isn't my daily framework - I have experience with internal
NestJS/Vue tools from a previous role, but Express is my main backend framework. I haven't used
GraphQL, all my API experience is REST. Basic AWS and CI/CD are covered: GitHub Actions, GitLab
CI, AWS on Quextro.

Happy to talk details or do a test task if that helps.

Portfolio: danolekh.com · GitHub: github.com/danolekh

## Form settings

- **Salary expectations:** $1,500. No band shown, Ukrainian company (rule: $1,500 with no
  visible band).
- **Resume variant:** `backend` (`me/resume/out/Resume-backend.pdf`) — role is backend-focused
  (Node/Express/NestJS/Postgres/GraphQL).
- **Timing:** fresh post (16 Sep), only 3 applications. Send today, no rush needed beyond that.
