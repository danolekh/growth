# Portfolio — links to lead with

Always have at least one **live, clickable** link ready. Live demos beat descriptions.

## Live projects / demos
- **Oasi Kadir** — agriturismo hotel site (**first Upwork win — completed 2026-07-17, 5.0 ★ review, $2,530**).
  - Stack: Astro + Strapi + Tailwind, i18n (IT/EN), Vercel + Railway.
  - **Performance-rescue proof (lead with these numbers):** mobile PageSpeed **69 → 99**, load time
    **~16s → under 2s**. The 5.0 review states them verbatim and adds: found/fixed hosting-compliance
    and DNS issues unprompted, structured updates, full handover docs, client owns all infrastructure.
    Full review in `../case-studies/oasi-kadir.md`.
  - **Case study (public):** https://www.danolekh.com/p/oasi-kadir — the link to put in proposals.
  - Demo: https://agriturismo.danolekh.com/ · Repo: https://github.com/danolekh/agriturismo
  - Good proof for: **site speed / Core Web Vitals rescue**, migrations, headless-CMS sites,
    multilingual marketing sites, clean component code, and **reverse engineering / rebuilds without
    source** — the old oasikadir.it was WordPress with a minified bundle and no source; Dan
    reverse-engineered its parallax carousel, card carousel, and menu animation and rebuilt them 1:1.
- **Azulejo** — handcrafted-ceramics e-commerce storefront (pet project, actively developed).
  - Live: https://azulejo.danolekh.com/ · **Local source: `~/code/terra-and-sol`** — open it to pull
    concrete specifics into a proposal (see "Deeper proof" below).
  - Stack: **TanStack Start** + TanStack Router/Query/Form (SSR, React 19), TypeScript, **Tailwind v4**
    + Base UI, **Drizzle ORM + PostgreSQL**, deployed on **Cloudflare Workers** (Hyperdrive), S3/R2
    media with **sharp + blurhash**, **Zod** validation, Vitest tests.
  - Functionality: faceted catalog (categories → products → variants/SKUs → attributes like
    color/finish/glaze/material), product detail pages with image galleries (embla carousel) +
    blurhash placeholders, collection/filter pages, artisan profiles (hours, Q&A, linked products),
    an editorial "journal", and a **Strapi** headless-CMS integration (article list/detail, block
    rendering, search + pagination). Plus a custom media pipeline (Hono upload-server + sharp/blurhash)
    and an AI catalog-image generation flow.
  - Good proof for: modern React **SSR** (TanStack Start / Next.js-style), **e-commerce** storefronts
    (catalog/PDP/variants/faceted filtering), **Drizzle + Postgres** data modeling, **headless CMS
    (Strapi)**, **Cloudflare** deployment, and image/media pipelines.
- **iFit** — e-commerce platform for sports equipment (Ukraine).
  - Good proof for: e-commerce, storefront + product catalog.

> **Retired as proof — never cite (Dan's call, 2026-07-18): qrorder, DocQA, Marque, AutoShip.**
> One-prompt builds Dan doesn't stand behind. Don't link or mention them in proposals, the profile,
> or anywhere client-facing, even if the URLs still resolve. Proof arsenal = Oasi Kadir (+ review),
> Azulejo, Quextro, iFit, the OSS PRs, and the GitHub repos below.

## Notable GitHub repos (https://github.com/danolekh — 36 public repos, OSS contributor)
- **product-filtering-example** — TypeScript, 17★ — dynamic product filtering.
- **drizzle-seeder** — TypeScript tool for seeding Drizzle databases.
- **slavicon** — TypeScript.
- **smartic** — TypeScript.
- **posthub** — TypeScript.
- **scape-portfolio** — Svelte portfolio.

## Open-source contributions (proof of real-world PR workflow + collaborative dev)
Use these when a client asks for bug-fix examples / PRs, or to show he works cleanly in someone
else's codebase (great for "extend/maintain existing code" jobs). All merged, all in his plain voice.
- **opentui** (anomalyco/opentui) - the terminal UI library that **opencode is built on**. Strong
  credibility flex. PR #558 (merged Jan 2026): added select-all (Cmd/Ctrl+A) + browser-like arrow-key
  text selection to textareas, and fixed a bug where selections broke on viewport change
  (touched `EditBufferRenderable.ts`). Link: https://github.com/anomalyco/opentui/pull/558
- **code-racer** (webdevcody/code-racer) - **top contributor in 2023** on the open-source multiplayer
  typing-race app led by WebDevCody. Good source of small, clean `fix:` PRs:
  - #698 (merged) - moved room ID generation to the websocket server to fix a caching issue. https://github.com/webdevcody/code-racer/pull/698
  - #660 (merged) - fixed the socket connection URL. https://github.com/webdevcody/code-racer/pull/660
  - #684 (merged Aug 2023) - Cypress test fix. https://github.com/webdevcody/code-racer/pull/684
  - #658 (merged Aug 2023) - feature: multiplayer race rooms (create/join, no auth, live updates). https://github.com/webdevcody/code-racer/pull/658
  - **Lead with #698 + #660 for "small bug-fix" asks; #658 when they want feature work.**

## Which link to lead with, by job type
- **Site speed / Core Web Vitals / "my site is slow" / rescue & migration** → the Oasi Kadir numbers
  (69→99, 16s→<2s) + https://www.danolekh.com/p/oasi-kadir + the 5.0 review. Strongest proof on the
  whole profile — this is the priority lane while banking reviews.
- **E-commerce / storefront / catalog / PDP / filtering / marketplace browsing** → **azulejo.danolekh.com** (live) + iFit + product-filtering-example.
- **Headless CMS / Strapi / multilingual site (incl. Astro)** → agriturismo.danolekh.com (live) + repo + Azulejo (Strapi blocks).
- **React/Next.js SaaS / dashboard / SSR** → Quextro (built solo, real users) + Azulejo (TanStack Start SSR); consider a quick demo.
- **RAG / LLM / AI integration** → Quextro (LLM pipelines parsing exam papers, AI study assistant — built solo).
- **Payments / ordering / admin dashboards** → Quextro + the 2,000-product admin (iFit). No live
  Stripe demo anymore — keep Stripe claims modest ("Stripe Checkout + webhooks") per `skills.md`.
- **Rebuilds / no-source / legacy code** → the Oasi reverse-engineering story (minified WordPress
  bundle → 1:1 Astro rebuild) + the OSS PRs.
- **Cloudflare Workers / edge deploy** → Azulejo (Workers + Hyperdrive).
- **Data layer / Drizzle / Postgres** → Azulejo + drizzle-seeder repo.

## Deeper proof — Azulejo source
The full Azulejo codebase is local at **`~/code/terra-and-sol`**. When a job needs a specific
capability (e.g. variant modeling, faceted filters, Cloudflare/Hyperdrive, image pipelines, Strapi
blocks), open that repo to cite the exact files/approach in the proposal instead of speaking generally.

> Keep this list updated: every new win or deployed demo gets added here with a one-line "good proof for" note.
