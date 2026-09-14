# Djinni application message — Маркетинг-Партнер (iGaming FullStack)

Post is in Ukrainian, company name is Ukrainian - send the Ukrainian version. English below in
case they want to see written English.

Angle: the domain and shape overlap with Dan's current job is the strongest thing on the whole
post - iGaming, microservices, event-driven, fullstack without a frontend/backend split. Lead
with that, then name GraphQL and the frontend-tooling gaps (Redux/MobX, Webpack,
styled-components) plainly.

## Ukrainian (send this one)

Ваш опис це майже один в один моя поточна робота: fullstack без поділу на "моя/не моя зона",
iGaming, мікросервіси, event-driven взаємодія між сервісами. Я саме зараз розробляю продакшн
iGaming-платформу такої ж форми.

Зараз я веду шість Node.js мікросервісів для iGaming-платформи (identity, gateway, wallet,
bonus, casino, notification) на Express, Drizzle, PostgreSQL і Redis, з Docker і GitLab CI.
Зробив per-brand GEO-правила доступу від схеми до React admin UI, і money-correctness роботу:
ідемпотентні виплати по індексу леджера, списання прострочених бонусів одним стейтментом,
ліміти на видачу бонусів проти зловживань. Ще посилив auth: жорсткі rate-ліміти на
логін/реєстрацію і події відкликання сесії при зміні або скиданні пароля. До цього соло зробив
Quextro, ed-tech платформу, з порожнього репозиторію до реальних користувачів: React 19 і
TanStack на фронті, Bun, Postgres і Drizzle на бекенді, Docker, GitHub Actions і OpenTelemetry
навколо. І робив Next.js 14 e-commerce з кастомною адмінкою на 2000+ товарів.

Чесно про прогалини, щоб не було сюрпризів. GraphQL я комерційно не використовував, мій
щоденний стиль API це REST. На фронті я працюю через Zustand, а не Redux чи MobX, і через
Tailwind, а не styled-components, Webpack-конфіги руками не пишу, працюю через тулінг
Next.js/Vite. NATS чи Kafka саме під цими іменами не використовував, хоча event-driven
взаємодія між сервісами й ідемпотентність це те, чим я займаюсь щодня прямо зараз, тож розібратися
в конкретному брокері не має бути довгим.

Портфоліо: danolekh.com. GitHub: github.com/danolekh, 39 репозиторіїв, є merged PR в opentui і
code-racer. Готовий до дзвінка або тестового завдання.

## English

Your post reads almost one to one like my current job: fullstack with no split between "my
zone" and "not my zone," iGaming, microservices, event-driven interaction between services. I'm
shipping a production iGaming platform of the same shape right now.

Right now I run six Node.js microservices for an iGaming platform (identity, gateway, wallet,
bonus, casino, notification) on Express, Drizzle, PostgreSQL and Redis, with Docker and GitLab
CI. I built per-brand GEO access rules end to end, from the schema to the React admin UI, and
money-correctness work: idempotent withdrawals keyed on the ledger index, single-statement
bonus expiry with debit, abuse limits on bonus issuance. I also hardened auth: strict rate
limits on login/register and session-revocation events on password change or reset. Before that
I built Quextro solo, an ed-tech platform, from an empty repo to real users: React 19 and
TanStack on the front, Bun, Postgres and Drizzle on the back, Docker, GitHub Actions and
OpenTelemetry around it. And I shipped a Next.js 14 e-commerce platform with a custom admin
panel for 2000+ products.

Honest about the gaps so there are no surprises. I haven't used GraphQL commercially, REST is
my daily API style. On the frontend I use Zustand rather than Redux or MobX, and Tailwind
rather than styled-components, and I don't hand-roll Webpack configs, I work through Next.js
and Vite tooling. I haven't used NATS or Kafka specifically by name, though event-driven
interaction between services and idempotency is exactly what I work on every day right now, so
picking up a specific broker shouldn't take long.

Portfolio: danolekh.com. GitHub: github.com/danolekh, 39 repos, merged PRs to opentui and
code-racer. Happy to jump on a call or do a test task.

## Form settings

- **Salary expectations:** $2,000. No numeric band shown in the post text (interview-negotiated),
  but the $$$$ Djinni tier and "product company, worldwide" point above the Ukrainian-company
  default, so use the EU/US product-company default rather than $1,500.
- **CV:** `me/resume/out/Resume-fullstack.pdf`
- **Timing:** published today (14 Sep), 13 applications so far - send soon, this is the hot job
  that triggered this run.
