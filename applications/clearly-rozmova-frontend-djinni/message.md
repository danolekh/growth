# Djinni application — Clearly (Rozmova)

Ukrainian post, English B1+ acceptable but the post itself and their "required skills: Native"
line point to Ukrainian. Send the Ukrainian version. English below in case they want to see
written English.

The post has a hard requirement: describe, along with the resume, a product decision that changed
a ticket's scope. "Reviews without this answer are not considered." The opening paragraph below is
written to satisfy that directly, so it also serves as the hook.

## Ukrainian (send this one)

На останньому контракті я побачив, що тікет на розсилку бонусної кампанії не мав жодного
передперегляду: бренд міг одним кліком розіслати бонус на весь неправильний сегмент, і відкотити
це складно, бо гроші вже пішли в гаманці. Я запропонував і зробив dry-run прорахунок кампанії з
причиною виключення для кожного юзера, перш ніж будь-який бонус реально нараховувався. Скоуп
тікета виріс, зате клас production-інцидентів з грошима закрився ще до релізу, а не після.

Продуктова робота з відповідальністю за наслідки власних рішень - це те, що в мене вже є. Quextro,
edtech-платформа, яку я побудував соло з порожнього репо до реальних користувачів (нею
користуються британські вчителі й учні): React 19 і TanStack на фронті, Bun, Effect.ts і Drizzle
на бекенді, CI/CD, Docker, OpenTelemetry - усі технічні й продуктові рішення були моїми. На
останньому контракті я також зробив per-brand GEO access rules end-to-end для живої iGaming-
платформи: схема, спільна decision-функція, лічильники на gateway, алерти на пороги, адмінка й
React UI, поряд з іншою money-correctness роботою - ідемпотентні виведення коштів, single-
statement bonus expiry, ліміти на видачу бонусів.

AI-інструменти - це те, як я вже працюю щодня: Claude Code на реальних фічах, і я перевіряю кожен
рядок перед комітом, а не приймаю все підряд. Монорепо теж не з доків - Turborepo в моєму
e-commerce проєкті (Azulejo, TanStack Start, Drizzle, Cloudflare Workers).

Чесно про розриви, бо ментал-хелс домен не пробачає сюрпризів. У вас 4+ роки комерційного React і
Next.js, у мене близько 2.5-3 років. WebRTC/Agora і Capacitor для мобільних застосунків я не
робив. З GrowthBook і A/B-тестуванням теж не працював, хоча SSR і гідратацію, тобто технічну
частину "без флікера", роблю регулярно. Redux Toolkit, MobX і SWR не мої інструменти, стабільно
працюю з TanStack Query і Zustand.

Портфоліо: danolekh.com · GitHub: github.com/danolekh

## English

On my last contract I noticed that the ticket for sending a bonus campaign had no preview step at
all: a brand could send a bonus to an entire wrong segment with one click, and rolling that back is
hard once the money is already in wallets. I proposed and built a dry-run calculation for the
campaign, with an exclusion reason per user, before any bonus was actually issued. The ticket's
scope grew, but it closed a whole class of money-related production incidents before release
instead of after.

Product work with real consequences for my own decisions is something I already have. Quextro, an
ed-tech platform I built solo from an empty repo to real users (used by British teachers and
students today): React 19 and TanStack on the front, Bun, Effect.ts and Drizzle on the back,
CI/CD, Docker, OpenTelemetry - every technical and product decision was mine. On the last contract
I also built per-brand GEO access rules end to end for a live iGaming platform: schema, a shared
decision function, gateway counters, threshold alerts, an admin CRUD and the React admin UI,
alongside other money-correctness work - idempotent withdrawals, single-statement bonus expiry,
abuse limits on bonus issuance.

AI tooling is just how I already work: Claude Code on real feature work, and I review every line
before committing rather than accepting it wholesale. Monorepos aren't just docs reading either -
Turborepo runs my e-commerce project (Azulejo, TanStack Start, Drizzle, Cloudflare Workers).

Honest about the gaps, because a mental-health domain doesn't forgive surprises. You want 4+ years
of commercial React and Next.js, I have around 2.5-3. I haven't built WebRTC/Agora video or
Capacitor mobile apps. I haven't used GrowthBook or run A/B tests either, though the flicker-free
SSR and hydration half of that is work I do regularly. Redux Toolkit, MobX and SWR aren't my tools,
I work steadily with TanStack Query and Zustand.

Portfolio: danolekh.com · GitHub: github.com/danolekh

## Form settings
- **Salary expectations:** $2,000. No specific number shown, only the $$$$ top Djinni tier; treated
  as a well-funded Ukrainian product company (like Feenko), so $2,000 not $1,500, but not pushed
  higher given the real years and mobile/video gaps.
- **CV:** `me/resume/out/Resume-frontend.pdf` (title is Front-end Developer, requirements are
  React/Next.js-heavy)
- **Timing:** posted 18 August, 348 applications already - not fresh, but the routine explicitly
  requested this draft. Send when ready, no rush advantage left on this one.
