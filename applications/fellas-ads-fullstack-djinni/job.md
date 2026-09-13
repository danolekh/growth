# Full Stack Developer — The Fellas Ads (Djinni)

- **Source:** Djinni.co · published 29 April 2025, updated 7 August 2026 · 423 views · 103 applications
- **Last responded:** more than a month ago ⚠️
- **Company:** The Fellas Ads, performance marketing agency, Amsterdam
- **Website:** https://thefellasads.com/
- **Salary band:** up to $1,700 /mo (form defaults to $1,200)
- **Languages:** English B2 + Ukrainian C1 (both ✅)
- **Hours:** remote, aligned to CET business hours (Kyiv is CET+1, fine)

## Posting-quality warning

Three signals say this listing is stale or recycled:
1. Published **April 2025**, still open, only bumped 7 Aug 2026.
2. **103 applications** and the recruiter **hasn't responded in over a month**.
3. The "Required skills experience" block lists **Spring Framework, Java, MySQL** — a Java stack that
   has nothing to do with the Node/Vanilla-JS description above it. Either a copy-paste from another
   vacancy or a template the company never cleaned up.

Low expected response rate. Cost is one message, so it's still worth sending, but this should not be
the application Dan spends his hope on.

## Fit analysis

**Genuinely strong**
- **Plain-JS debugging with no framework to hide behind** — the Oasi Kadir rebuild is exactly this:
  old site was WordPress with a minified production bundle, no source. He reverse-engineered the
  parallax carousel, card carousel and menu animation from the shipped bundle and reimplemented them
  1:1 (`me/skills.md`, Domain/Other).
- **Performance for conversion-focused pages** (their nice-to-have) — 69→99 mobile PageSpeed,
  ~16s→<2s, 5.0 review, public case study.
- **i18n / multi-locale routing** — IT/EN on Azulejo, locale routing done for real.
- **Node + Express APIs, Docker, GitHub Actions, Linux, webhooks and async flows** — daily tools.
- **E-commerce background** — Next.js storefront + custom admin panel, 2000+ products.
- **Ukrainian C1 ✅, English B2 ✅, CET overlap ✅.**

**Real gaps (name them, don't paper over)**
- **Nginx** — not in `me/skills.md`. He's worked behind reverse proxies (Vercel, Cloudflare) but has
  not owned production Nginx configs, SSL/Let's Encrypt, subdomain routing.
- **Payments** — Stripe Checkout + webhooks only, and kept modest per the honesty guardrails. **No
  PayPal, Apple Pay, Google Pay or 3DS.** This is one of their core requirements.
- **DigitalOcean / VPS ops** — his deploys are Vercel, Cloudflare, Railway, AWS. No VPS + firewall
  + rsync/SSH deployment ownership.
- **"Prefers Vanilla JS over heavy frameworks"** — his recent work is React/Next. The
  reverse-engineering story is the honest bridge, but this is a cultural mismatch worth knowing.
- **3+ years** — his profile says 1.5 (defensibly ~2.5 counting Radency + freelance + Quextro).

## Verdict

**Apply, low priority.** Two of their core requirements (payment provider integrations with 3DS,
production Nginx) are genuine misses, and the posting looks half-abandoned. But the plain-JS
debugging + conversion-performance angle is a real, provable hook that most of the 103 applicants
can't match, and a Djinni message costs nothing but ten minutes.

**Salary ask: $1,300.** Band goes to $1,700, but with two core requirements missing, asking near the
top invites a no. $1,300 matches the locked Djinni profile number and stays consistent with the
Iteam application.
