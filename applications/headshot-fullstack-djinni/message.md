# Djinni application — Headshot

Post is in Ukrainian, so send the Ukrainian version. English version below in case they want to
see written English.

## Ukrainian (send this one)

Ваш опис - це майже точна копія платформи, з якою я останнім часом працював: шість Node.js
мікросервісів для live iGaming-платформи (identity, gateway, wallet, bonus, casino, notification)
на Express, Drizzle, Postgres і Redis, з GitLab CI. Я спроєктував і побудував сервіс GEO-правил
доступу для кожного бренду з нуля: схему, спільну функцію прийняття рішень, лічильники на
гейтвеї, алерти при перетині порогів, адмінську CRUD-частину та React UI для неї.

У money-correctness частині я робив ідемпотентні виведення коштів, прив'язані до індексу леджера,
списання прострочених бонусів одним запитом, ліміти на видачу бонусів і dry-run розрахунок
кампаній з причинами виключення для кожного користувача. Це саме та архітектурна робота, яку ви
просите пояснювати: чому обрано конкретне рішення і як воно перевіряється тестами.

На фронтенді я побудував Next.js 14 App Router e-commerce платформу з власною адмінкою на 2000+
товарів, а до цього соло зробив Quextro, ed-tech платформу, від порожнього репозиторію до
реальних користувачів - нею користуються британські вчителі та учні. React 19 і TanStack на
фронті, Bun і Postgres з Drizzle на бекенді.

Чесно про прогалини, бо ваш стек їх одразу покаже. Мій продакшн-досвід з API це REST, а не
GraphQL, тож бекенд GraphQL мені доведеться піднімати з нуля. Message-брокери на кшталт NATS,
Kafka чи RabbitMQ я не використовував - у моєму event-driven стеку Redis обробляв лічильники,
рейт-ліміти і події ревокації сесій без окремої черги. З NoSQL (MongoDB, Cassandra) досвіду немає,
весь мій SQL - Postgres з Drizzle. Стейт-менеджмент тримаю на Zustand, Redux чи MobX в продакшені
не використовував.

Таймзона Кіпру мені підходить, я у Відні, різниця близько години. Готовий до тестового завдання,
якщо це найшвидший спосіб перевірити.

Портфоліо: danolekh.com · GitHub: github.com/danolekh

## English

Your post reads almost exactly like the platform I worked on most recently: six Node.js
microservices for a live iGaming platform (identity, gateway, wallet, bonus, casino,
notification), built on Express, Drizzle, Postgres and Redis, with GitLab CI. I designed and built
the per-brand GEO access-rules service end to end: the schema, the shared decision function,
gateway counters, threshold alerts, the admin CRUD and the React admin UI.

On the money-correctness side I built idempotent withdrawals keyed on the ledger index,
single-statement bonus expiry with debit, abuse limits on bonus issuance, and campaign dry-run
calculation with per-user exclusion reasons. That's the kind of architectural work your post asks
people to explain: why a decision was made and how it gets tested.

On the frontend I built a Next.js 14 App Router e-commerce platform with a custom admin panel for
2,000+ products, and before that built Quextro solo, an ed-tech platform, from an empty repo to
real users - it's used by British teachers and students today. React 19 and TanStack on the front,
Bun and Postgres with Drizzle on the back.

Honest about the gaps, since your stack will surface them fast. My production API work has been
REST, not GraphQL, so I'd be picking up backend GraphQL from scratch. I haven't used a message
broker like NATS, Kafka or RabbitMQ - in my event-driven stack Redis handled counters, rate limits
and session-revocation events without a separate queue. No NoSQL experience either, my SQL has all
been Postgres with Drizzle. State management is Zustand day to day, no Redux or MobX in
production.

Cyprus timezone works fine for me, I'm based in Vienna, about an hour off. Happy to do a test task
if that's the fastest way to check.

Portfolio: danolekh.com · GitHub: github.com/danolekh

## Form settings
- **Salary expectations:** $2,000. No numeric band shown, only $$$$ (top Djinni band); worldwide
  remote product company, so treat it as the EU/US product-company default rather than the $1,500
  Ukrainian-company default.
- **CV:** `me/resume/out/Resume-fullstack.pdf`
- **Timing:** published today (17 Sep), only 3 applications so far, marked hot in the queue. Send
  as soon as possible today.
