# Djinni application message — Duanex

## English (primary)

Hi! Node, Next.js, TypeScript and Postgres are what I work in every day, and the data-correctness
part of this is the bit that actually interests me.

I built Quextro, an ed-tech platform, solo from an empty repo to real users, now used by British
teachers and students. Node and Bun with Postgres and Drizzle on the back, React 19 and TanStack on
the front, Docker, GitHub Actions, OpenTelemetry for observability. Its core is a pipeline that
ingests PDF exam papers and turns them into structured questions and topics, so I know the shape of
the problem you're describing: messy input from a source you don't control, output people rely on,
and you're the one debugging it when a sync quietly produces wrong rows.

Postgres is where I'm most comfortable. Hand-rolled schemas and migrations with Drizzle, variant
and attribute modeling for an e-commerce catalog, a custom admin panel covering 2000+ products.
Before that I worked on a multi-tenant React/Express system at Radency with 10,000+ active users. I
write Vitest tests and keep type and lint checks running on CI.

On AI tooling: I've used Claude Code daily for over a year on real feature work, so that part of
your process is already how I work.

Two honest notes. I haven't used BullMQ or Supabase specifically, though Supabase is Postgres
underneath and I've built scheduled and webhook-driven flows. And working until 20:00 Kyiv for US
overlap is fine by me.

Portfolio: danolekh.com · GitHub: github.com/danolekh

## Ukrainian (if the team writes in Ukrainian)

Вітаю! Node, Next.js, TypeScript і Postgres це те, з чим я працюю щодня, а частина про коректність
даних мені найцікавіша.

Я зробив Quextro, ed-tech платформу, соло з нуля до реальних користувачів, нею користуються
британські вчителі та учні. Node і Bun з Postgres і Drizzle на бекенді, React 19 і TanStack на
фронті, Docker, GitHub Actions, OpenTelemetry. В основі пайплайн, який приймає PDF з
екзаменаційними завданнями і перетворює їх на структуровані питання й теми, тож форма вашої задачі
мені знайома: брудний вхід із джерела, яке ти не контролюєш, вихід, на який люди спираються, і ти ж
розбираєшся, коли синк тихо записав неправильні рядки.

Postgres це моя найсильніша зона: схеми й міграції руками через Drizzle, моделювання варіантів і
атрибутів для каталогу, власна адмінка на 2000+ товарів. До того в Radency працював над
мультитенантною системою (React/Express) з 10 000+ активних користувачів. Пишу тести на Vitest,
тримаю перевірки типів і лінту в CI.

Щодо AI-інструментів: Claude Code використовую щодня понад рік на реальних фічах.

Дві чесні ремарки. З BullMQ і саме з Supabase не працював, хоча під Supabase той самий Postgres, а
заплановані та вебхук-флоу я будував. І робота до 20:00 за Києвом для перетину зі США мене
влаштовує.

Портфоліо: danolekh.com · GitHub: github.com/danolekh
