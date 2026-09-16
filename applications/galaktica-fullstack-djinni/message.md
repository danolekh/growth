# Djinni application — Galaktica

Пост українською, компанія українська - надсилаю українську версію. Англійська нижче про всяк
випадок.

Кут: Node/Postgres/Redis продакшн-досвід збігається один в один, Quextro як доказ самостійної
архітектурної відповідальності, а прогалини (5 років, NestJS не комерційно, MongoDB, Stripe
підписки) назвати прямо, а не чекати технічної співбесіди.

## Українська (надіслати цю)

Ваш стек Node.js і React це моя щоденна робота, а Postgres і Redis - те, з чим я працював у
продакшені останній рік. Одразу чесно: у вас вимога 5 років, у мене 3, і я хочу проговорити цей
ризик, а не ховати його.

На останньому контракті я здав шість Node.js мікросервісів для живої iGaming платформи (identity,
gateway, wallet, bonus, casino, notification) на Express, Drizzle і Postgres, з Redis для
лічильників і rate limit, усе в Docker за GitLab CI. Там же зробив money-correctness частину:
ідемпотентні виплати за ledger-індексом, списання прострочених бонусів одним запитом з дебетом,
ліміти проти зловживань нарахуванням бонусів.

До того я соло побудував Quextro, ed-tech платформу, з порожнього репозиторію до реальних
користувачів - британські вчителі та учні користуються нею сьогодні. Bun, Effect.ts і Drizzle на
бекенді, React 19 і TanStack на фронті, весь CI/CD, Docker і OpenTelemetry теж мої рішення. Це
найближче, що в мене є до самостійної архітектурної відповідальності, яку ви описуєте в пості.

Чесно про прогалини, бо краще назвати їх одразу. NestJS у мене не комерційний досвід, тільки
внутрішні Vue/NestJS інструменти на попередній роботі, тому глибокого продакшн NestJS я не
заявляю. MongoDB я не використовував, моя база - Postgres. Зі Stripe я робив Checkout і вебхуки,
але не підписки й recurring payments у продакшені, і це найбільша прогалина зі списку.

Плюси зі списку закриваю повністю: Vitest і Testing Library для тестів, GitHub Actions і GitLab CI
для CI/CD, Docker щодня, AWS з досвіду Quextro.

Готовий обговорити, чи це прийнятний для вас ризик.

Портфоліо: danolekh.com · GitHub: github.com/danolekh

## English

Your stack, Node.js and React, is my daily work, and Postgres and Redis are what I worked with in
production over the last year. Honest upfront: your post asks for 5 years, I have 3, and I'd
rather name that risk than hide it.

On my last contract I shipped six Node.js microservices for a live iGaming platform (identity,
gateway, wallet, bonus, casino, notification) on Express, Drizzle and Postgres, with Redis for
counters and rate limits, all in Docker behind GitLab CI. Part of that was money-correctness work:
idempotent withdrawals keyed on the ledger index, single-statement bonus expiry with debit, abuse
limits on bonus issuance.

Before that I built Quextro, an ed-tech platform, solo from an empty repo to real users - British
teachers and students use it today. Bun, Effect.ts and Drizzle on the backend, React 19 and
TanStack on the front, all the CI/CD, Docker and OpenTelemetry decisions were mine too. That's the
closest I have to the independent architectural ownership your post describes.

Honest about the gaps, better to name them now. NestJS isn't commercial experience for me, only
internal Vue/NestJS tooling at a previous job, so I'm not claiming deep production NestJS. I
haven't used MongoDB, my database has been Postgres. On Stripe I've done Checkout and webhooks, not
subscriptions or recurring payments in production, and that's the biggest gap on your list.

The nice-to-haves I cover fully: Vitest and Testing Library for tests, GitHub Actions and GitLab CI
for CI/CD, Docker daily, AWS from Quextro.

Happy to talk through whether that risk works on your side.

Portfolio: danolekh.com · GitHub: github.com/danolekh

## Form settings
- **Salary expectations:** $1,500. Djinni shows `$$$$` (top symbolic tier) but no numeric range,
  so treated as no visible band. Kept at the Ukrainian-company default rather than reaching, given
  the years-stretch and the MongoDB/Stripe-subscriptions gaps named in the message.
- **CV:** `me/resume/out/Resume-fullstack.pdf`
- **Timing:** posted today (16 Sep), 13 applications already. Send today.
