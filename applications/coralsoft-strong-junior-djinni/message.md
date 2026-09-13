# Djinni application — Coralsoft (Strong Junior Full-Stack)

**Language call:** the post is written in English and they build for startup clients, so send the
**English message** (it doubles as the B1+ English sample they asked for). Answer the five screening
questions in **Ukrainian**, because that's the language they were asked in. Ukrainian version of the
message is below if he'd rather keep everything in one language.

---

## Message (send this one)

Hi! I'm a full-stack TypeScript developer from Kyiv with 2 years of commercial experience, and your
stack is close to one to one what I work in every day.

The part of the job that caught me is "different client projects across various domains", because
that's already how I work. Most of my recent work has been dropping into someone else's codebase or
an empty repo, figuring out the domain fast, and shipping something the client can actually run
afterwards.

Two things worth a look. Quextro is an ed-tech platform I built solo from an empty repo to real
users, now used by British teachers and students: React 19 and TanStack on the front, Node and Bun
with Postgres on the back, Docker, GitHub Actions, and an LLM pipeline that pulls questions and
topics out of PDF exam papers. Before that I shipped a Next.js e-commerce platform with a custom
admin panel for 2000+ products, and at Radency I worked on a multi-tenant React/Express system with
10,000+ active users plus internal Vue/NestJS tools used daily by the HR department.

The most recent one is closest to client work. A client's site was a WordPress build with a minified
bundle and no source. I reverse-engineered the animations out of the production bundle, rebuilt the
site on Next.js, and took mobile PageSpeed from 69 to 99 and load time from about 16 seconds to under
2. Case study: danolekh.com/p/oasi-kadir.

On AI tools, I've used Claude Code daily for over a year on real feature work, and I treat it as
something I review rather than trust. More detail in the screening answer.

Honest on stack details so nothing surprises you in week one. My ORM is Drizzle rather than Prisma
and my Postgres is usually plain or on Neon rather than Supabase, both a day of ramp. For state I
reach for Zustand and TanStack Query more than Redux Toolkit. NestJS I've used for internal tools,
not as my main backend. React Native and Expo I haven't shipped commercially.

Portfolio: danolekh.com · GitHub: github.com/danolekh · Upwork: upwork.com/freelancers/danolekh
(Rising Talent, 5.0 review)

---

## Screening answers (Ukrainian)

**1. Скільки років комерційного досвіду в розробці ви маєте?**

2 роки.

**2. Чи маєте ви комерційний досвід із React та Next.js?**

Yes

**3. Чи маєте ви практичний досвід backend-розробки на Node.js?**

Yes

**4. Чи використовуєте ви AI coding tools (Codex, Claude Code, Cursor або аналоги) у щоденній
розробці?**

Yes

**5. Коротко опишіть, як ви використовуєте AI-інструменти у розробці та наведіть приклад задачі, яку
вирішували з їх допомогою.**

Claude Code використовую щодня понад рік, це мій основний інструмент. Робочий процес такий: спочатку
прошу розібратися в коді й описати план, читаю план і правлю його, і тільки потім даю писати код.
Тримаю зміни маленькими, все читаю перед комітом і не мержу того, що не можу пояснити сам. Найбільше
виграю на трьох речах: швидко зорієнтуватися в чужому легасі, рутинні рефактори й міграції, і тести.

Конкретний приклад. Клієнтський сайт був на WordPress з мініфікованим бандлом і без вихідного коду, а
треба було перенести його на Next.js і зберегти анімації один в один: паралакс-карусель, карусель
карток і анімацію меню. Разом з Claude Code я розібрав продакшн-бандл, дістав звідти логіку цих
компонентів і переписав їх на React. Далі в тому ж режимі пройшовся по продуктивності: зображення,
шрифти, блокуючі скрипти. Результат: mobile PageSpeed з 69 до 99, час завантаження з ~16 секунд до
менш ніж 2, відгук клієнта 5.0.

Ще один приклад ближче до бекенду: в Quextro я зробив пайплайн, який витягує питання й теми з PDF
з екзаменаційними завданнями через LLM. Там уже AI всередині продукту, а не тільки в редакторі, тож
знайомі й неприємні частини: вхід, який ти не контролюєш, валідація виходу через Zod і ретраї, коли
модель тихо повернула не те.

---

## Message (Ukrainian version, if he prefers one language)

Вітаю! Я фулстек TypeScript розробник з Києва, 2 роки комерційного досвіду, і ваш стек майже один в
один те, з чим я працюю щодня.

Що зачепило у вакансії: "different client projects across various domains". Це вже мій режим роботи.
Останнім часом більшість задач це зайти в чужу кодову базу або в порожній репозиторій, швидко
розібратися в домені й віддати щось, що клієнт реально зможе далі обслуговувати.

Два проєкти, на які варто глянути. Quextro це ed-tech платформа, яку я зробив соло з нуля до живих
користувачів, зараз нею користуються британські вчителі та учні: React 19 і TanStack на фронті, Node
і Bun з Postgres на бекенді, Docker, GitHub Actions і LLM-пайплайн, що витягує питання й теми з PDF
з екзаменаційними завданнями. До того зробив e-commerce на Next.js з власною адмінкою на 2000+
товарів, а в Radency працював над мультитенантною системою (React/Express) з 10 000+ активних
користувачів і робив внутрішні інструменти на Vue/NestJS для HR-департаменту.

Найсвіжіший проєкт найближчий до клієнтської роботи. Сайт клієнта був на WordPress з мініфікованим
бандлом і без вихідного коду. Я витягнув анімації з продакшн-бандла, перебудував сайт на Next.js і
підняв mobile PageSpeed з 69 до 99, а час завантаження зменшив з ~16 секунд до менш ніж 2. Кейс:
danolekh.com/p/oasi-kadir.

Щодо AI-інструментів: Claude Code щодня понад рік на реальних фічах, і я ставлюся до нього як до
того, що треба перевіряти, а не приймати на віру. Деталі в відповіді на питання анкети.

Чесно про деталі стеку, щоб не було сюрпризів на першому тижні. Мій ORM це Drizzle, а не Prisma,
Postgres зазвичай звичайний або Neon, а не Supabase, обидва це день розгону. Зі стейтом частіше
беру Zustand і TanStack Query, ніж Redux Toolkit. NestJS використовував для внутрішніх інструментів,
не як основний бекенд. React Native і Expo комерційно не робив.

Портфоліо: danolekh.com · GitHub: github.com/danolekh · Upwork:
upwork.com/freelancers/danolekh (Rising Talent, відгук 5.0)

---

## Form settings

- **Salary expectations:** put **$1,100**, not the $800 the form pre-fills. The band is $800–1,200,
  he clears every requirement, and $800 anchors him at the floor of a role he's over-qualified for on
  the AI-tooling side. $1,100 still sits under their cap so it doesn't trip the filter.
- **Fix the profile number too.** The $800 in the form comes from his Djinni profile, and it's
  quietly under-asking on every application. `me/djinni-profile.md` locks $1,300 as the decision, so
  the profile should say $1,300.
- **CV:** attach Resume.pdf.
- **Save as template:** no, this one is job-specific.
- **Timing:** 37 applications and climbing on day one. Send today.
