# Feenko — Full-Stack Web Developer (TypeScript)

- **Source:** Djinni.co
- **Published:** 8 September 2026 · 470 views · 243 applications
- **Salary band:** $$$$ (top band on Djinni). Form prefilled at $2,000.
- **Company:** personal-finance mobile product. Launched ~1 year ago, 100,000+ users, positive unit
  economics, US-focused, recent Visa partnership. Ukrainian team. https://feenko.com
- **Language requirement:** Ukrainian **Native**, English B1+. Send the Ukrainian version.

## The role
Sole owner of the web direction: the growth funnel, the admin panel and the support site. Weekly
A/B experiments across landings, quiz, paywall and checkout. Own Stripe and Solidgate. Debug the
revenue path yourself via Amplitude, Sentry, logs and the database.

## Tech stack (theirs)
TypeScript · **Astro** · **Tailwind** · **Zod** · **Vercel** serverless · **Neon Postgres** ·
Stripe · Solidgate · GrowthBook · Amplitude · Sentry · **Vitest**

That core line is almost exactly Dan's default stack and the Oasi Kadir stack.

## Requirements
| Requirement | Dan's position |
|---|---|
| 3+ yr commercial full-stack TypeScript | **Stretch.** ~2.5 years |
| Strong Astro or Next.js | **Strong yes.** Astro on Oasi Kadir, Next.js 14 on the e-commerce build |
| Production payments: checkout, subscriptions, webhooks, idempotency | **Weakest point.** Stripe Checkout + webhooks only. No subscriptions, no upsells, no Solidgate. Keep the claim modest per `me/skills.md` |
| Web2app / quiz funnels / paywalls / trials | **Gap.** No funnel or paywall work |
| Serverless (Vercel) + PostgreSQL | **Strong yes.** Vercel, Cloudflare Workers, Postgres with Drizzle |
| A/B testing internals: bucketing, no flicker, clean events | **Gap on tooling,** but the flicker half is exactly the SSR and hydration work he does |
| Independent full-stack debugging, tests before shipping | **Yes.** Vitest, CI type and lint checks, OpenTelemetry |
| English Intermediate+ | **Yes** |

**Nice to have:** Tailwind + pixel-perfect Figma (**yes, strong**) · Vitest (**yes**) ·
Sentry (OpenTelemetry instead) · Amplitude (**no**) · GrowthBook / Statsig (**no**) ·
Meta/TikTok pixels, AppsFlyer (**no**)

## Verdict
**Apply, highest conviction of the three.** The core stack is one for one. The strongest angle is
that a revenue funnel lives or dies on load speed, and the 69 to 99 mobile PageSpeed rescue with
load time from ~16s to under 2s is the hardest proof on his whole profile, on Astro, on Vercel, with
a 5.0 review attached.

**Angle:** Astro plus funnel speed, then solo ownership from Quextro since they want one engineer
owning a whole direction. Name the payments depth and the funnel and experimentation gaps plainly.
