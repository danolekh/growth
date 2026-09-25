# Djinni application — Galaktica

Ukrainian post, Ukrainian company, so send the Ukrainian version. English below in case they want
written English.

Angle: lead with the LLM pipeline from Quextro (closest proof to "integrate an LLM, build
prompts, control output quality") and the recent Node/Postgres/Redis production work, name the
NestJS depth gap and the zero astrology experience plainly, close with the Claude Code line since
it's on their own wishlist.

## Ukrainian (send this one)

Ваш пост про Джйотіш - найнезвичніший бриф, який я бачив на Джині, і саме тому пишу. Розрахункове
ядро, яке перетворює правила в чистий тестований код, плюс LLM-пайплайн з контролем якості видачі -
це рівно та комбінація, з якою я вже працював, тільки в іншому домені.

На Quextro я зробив соло LLM-пайплайн, що витягує питання і теми з PDF екзаменаційних робіт,
продуктом досі користуються британські вчителі та учні. Там же я спроєктував базу даних і REST API
з нуля, React 19 на фронті. На останньому контракті я писав event-driven Node-мікросервіси
(Express, Drizzle, Postgres, Redis) для продакшн iGaming-платформи, включно з логікою навколо
грошей: ідемпотентні виведення коштів на індексі леджера, списання прострочених бонусів одним
statement з перевіркою балансу.

Чесно про прогалини. Джйотіш і астрологію я не знаю зовсім - ваш же пост каже, що розрахунки
звіряються з доменними експертами, тож сприймаю це як те, що вивчається в процесі, а не як блокер.
NestJS я використовував на внутрішніх інструментах (Vue/NestJS у Radency), а не в глибокій
продакшн-архітектурі з guards і DI, як у вас хочуть - основний продакшн-стек для мене був Express.
З Prisma не працював, моя ORM щодня це Drizzle, але перейти швидко не проблема. Тести пишу на
Vitest, не Jest, дисципліна та сама: юніт і інтеграційні перевірки перед кожним мерджем.

Claude Code - мій щоденний інструмент на реальних фічах, з рев'ю кожного рядка, тож AI-асистенти в
розробці вже звична частина мого процесу.

Портфоліо: danolekh.com · GitHub: github.com/danolekh

## English

Your Jyotish post is the most unusual brief I've seen on Djinni, which is exactly why I'm writing.
A calculation core that turns rules into clean, tested code, plus an LLM pipeline with quality
control on the output, is exactly the combination I've already worked in, just in a different
domain.

At Quextro I built a solo LLM pipeline that extracts questions and topics from PDF exam papers,
still used today by British teachers and students. On the same project I designed the database and
REST API from scratch, React 19 on the front end. On my last contract I wrote event-driven Node
microservices (Express, Drizzle, Postgres, Redis) for a production iGaming platform, including
money-correctness work: idempotent withdrawals keyed on the ledger index, single-statement bonus
expiry with a balance check.

Honest about the gaps. I know nothing about Jyotish or astrology as a domain, though your own post
says the calculations get validated with domain experts, so I read that as learnable rather than a
blocker. I've used NestJS on internal tooling (Vue/NestJS at Radency), not the deep production
architecture with guards and DI you're asking for; my main production stack has been Express. I
haven't worked with Prisma, my daily ORM is Drizzle, but switching quickly isn't a problem. Tests
are Vitest, not Jest, same discipline: unit and integration checks before every merge.

Claude Code is my daily tool on real feature work, with a review of every line it writes, so AI
assistants in development are already a normal part of how I work.

Portfolio: danolekh.com · GitHub: github.com/danolekh

## Form settings

- **Salary expectations:** $1,500. Ukrainian company, $$$ band with no visible number, per the
  income-plan default for Ukrainian companies.
- **CV:** `me/resume/out/Resume-fullstack.pdf`
- **Timing:** posted today (25 Sep), 5 applications so far. Send now while it's fresh.
