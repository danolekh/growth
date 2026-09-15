# Djinni application — Todor3D

Ukrainian post, Ukrainian company → send the Ukrainian version. English below in case they want to
see written English.

Angle: the post's core ask is "AI as your primary dev tool", which is literally Dan's daily
practice with Claude Code. Quextro (built solo, LLM algorithm extracting questions from PDFs, real
users) is the closest proof of framing a task for AI and shipping it past demo stage. Name the
n8n/Make and Airtable gaps plainly.

## Ukrainian (send this one)

Вітаю! Ви шукаєте людину, для якої Claude Code, Codex чи Gemini CLI - основний інструмент розробки,
а не просто спосіб пришвидшити код. Це точно про мене: я щодня веду фічі через AI-агента, від
постановки задачі з контекстом до критичної перевірки результату перед мержем.

Я full-stack TypeScript розробник, три роки комерційного досвіду. Найближчий доказ роботи з AI -
Quextro, ed-tech платформа, яку я зробив соло з нуля: я спроєктував і написав саме LLM-алгоритм, що
витягує питання й теми з PDF екзаменаційних робіт, і зараз нею користуються британські вчителі та
учні. Це показує, як я ставлю задачу перед AI, перевіряю результат на реальних даних і доводжу
рішення до продакшну, а не залишаю на рівні демо.

По вашому списку конкретно. REST API, вебхуки й авторизація (токени, JWT, OAuth) - це те, чим я
займався на останньому контракті: rate limits на логін і сесії, що інвалідуються подіями. SQL і
Postgres - щоденна робота через Drizzle ORM. Supabase, включно з Postgres, RLS і Edge Functions, я
використовував у кількох клієнтських проєктах. Docker і деплой невеликих сервісів мені знайомі, Git
з conventional commits теж.

Чесно про прогалину: у n8n чи Make я руками не працював. Таку логіку - розгалуження, обробку
помилок, повторні запуски - я зазвичай пишу кодом, а не в конструкторі нод, тож сама логіка знайома,
інструмент новий. З Airtable теж не працював, тільки SQL. Готовий швидко в це зайти, або, де це
доречніше, написати частину як окремий сервіс кодом замість воркфлоу.

Портфоліо: danolekh.com · GitHub: github.com/danolekh

## English

Hi! You're looking for someone who treats Claude Code, Codex or Gemini CLI as the main development
tool, not just a way to write code faster. That's exactly how I work: I run features through an AI
agent daily, from framing the task with the right context to critically checking the result before
it merges.

I'm a full-stack TypeScript developer with three years of commercial experience. The closest proof
of AI-driven work is Quextro, an ed-tech platform I built solo from an empty repo: I designed and
wrote the core LLM algorithm that extracts questions and topics from PDF exam papers, and it's now
used by British teachers and students. That shows how I frame a task for AI, check the output
against real data, and take it to production instead of stopping at a demo.

On your specific list. REST APIs, webhooks and auth (tokens, JWT, OAuth) were recent work on my
last contract: rate limits on login and sessions that get invalidated by events. SQL and Postgres
are daily work
through Drizzle ORM. I've used Supabase, including Postgres, row-level security and Edge Functions,
across several client projects. Docker and deploying small services are familiar too, and Git with
conventional commits is how my history reads.

Honest about the gap: I haven't worked hands-on in n8n or Make. I usually write that kind of logic,
branching, error handling, retries, as code rather than in a node builder, so the logic is familiar
even if the tool is new. I haven't used Airtable either, just SQL. Happy to ramp into it fast, or
write a piece as a small service instead of a workflow where that fits better.

Portfolio: danolekh.com · GitHub: github.com/danolekh

## Screening answers

**1. Який AI-інструмент для кодингу ви використовуєте найчастіше та для яких задач?**

Claude Code - основний, використовую щодня вже більше року. Веду через нього фічі: спочатку прошу
розібратися в задачі і скласти план, читаю план і правлю його, і тільки потім даю писати код, а
кожен diff перевіряю перед комітом сам. Найбільше виграю на розборі чужого легасі, рутинних
рефакторах, міграціях і тестах. Пробував також Codex і Gemini CLI, але основним лишається Claude
Code.

**2. З якими інструментами автоматизації (n8n, Make тощо) ви працювали та які за складністю сценарії створювали? Коротко опишіть приклад.**

Чесно: руками в n8n чи Make не працював. Таку логіку - розгалуження, обробку помилок, повторні
запуски, вкладені кроки - я завжди писав кодом, а не в конструкторі нод, тож сама логіка знайома,
інструмент новий. Приклад з коду: на останньому контракті я робив ревокацію сесій за подією зміни
пароля - подія з auth-сервісу інвалідує активні сесії через gateway, з ретраями й обробкою помилок
на кожному кроці. Готовий швидко зайти в n8n чи Make, бо принципи ті самі.

**3. Який у вас рівень JavaScript / TypeScript?**

TypeScript - моя основна мова, щодня і глибоко, вже три роки комерційного досвіду. Пишу нею і
бекенд (Node, Bun, Express), і фронт (React, Next.js, Astro), завжди в strict-режимі. JavaScript
знаю на тому ж рівні.

**4. Чи маєте досвід роботи з REST API, вебхуками та авторизацією?**

Так. На останньому контракті (live iGaming платформа) я робив rate limits на логін і реєстрацію та
сесії, що інвалідуються подіями при зміні пароля, все через токени. REST API і вебхуки - щоденна
робота: Stripe Checkout з вебхуками і перевіркою підпису, OAuth-провайдери через Supabase Auth.
JWT і токенна авторизація - звичний стек.

**5. Чи створювали ви AI-агентів?**

Окремого продукту у форматі "агент, що сам приймає рішення і викликає тули" не робив, але LLM
усередині продукту - так. В Quextro я спроєктував і написав алгоритм, що бере PDF з екзаменаційними
завданнями, прогонає через LLM і витягує структуровані питання й теми, з валідацією виходу через
Zod і ретраями, коли модель повертає не те. Продуктом користуються британські вчителі й учні. Сам
патерн - дати AI задачу з контекстом, перевірити результат, обробити помилку - мені знайомий.

## Form settings

- **Salary expectations:** $1,500. No real numeric band shown (Djinni's lowest `$` tier only), so
  default to the Ukrainian-company rule.
- **CV:** `me/resume/out/Resume-fullstack.pdf`
- **Timing:** posted today (15 Sep), 16 views, 2 applications. Send now, this is as fresh as it gets.
