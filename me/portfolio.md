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
- **Sportmagaz** — sports-equipment store for Ukraine, **built and deployed solo** (freelance, 2024;
  re-platformed 2026). Older files called it "iFit"; the ifit.danolekh.com card is gone.
  - Live: https://sportmagaz.com.ua · Admin: cms.sportmagaz.com.ua (private) ·
    **Case study: https://www.danolekh.com/p/sportmagaz** · Local source: `~/code/sportmagaz`
  - 2024 build: Next.js 14 + tRPC + Drizzle + PostgreSQL in a Turborepo monorepo, a **custom admin CMS
    for 2,000+ products** (roles, specs editor, S3 image manager with cropping, Tiptap), attribute
    filters with live "+N" counts, Nova Poshta lookup, Telegram order alerts, Google Merchant feed.
  - 2026 re-platform: static Astro + React islands on Cloudflare Workers, **view transitions** (the
    product photo morphs from the card into its page), Effect checkout worker with server-side prices.
  - Good proof for: **e-commerce**, custom admin panels / CMS, catalog filtering, Next.js, Astro
    re-platforms, smooth navigation, Ukrainian delivery integrations, solo delivery.
- **Consolline** — site of an international logistics company, **built solo in Astro** (2026).
  - Live: https://consolline.com · **Case study: https://www.danolekh.com/p/consolline** ·
    Local source: `~/work/consolline/web`
  - 4 languages (uk/en/pl/ru), 148 static pages, custom **WebGL2 shaders** (interactive globe,
    pointer-reactive halftone field), scroll-driven sections with no animation library, headlines
    sized at build time so no language shifts layout, checked against Figma with pixel diffs.
  - Claim the Astro site, animations, i18n and the checks. Don't claim its deploy pipeline or the base
    pixel-diff scripts (teammates' work).
  - Good proof for: **Astro**, animation-heavy and WebGL front ends, multilingual marketing sites,
    **Figma precision**, no-layout-shift typography across languages.

> **Retired as proof — never cite (Dan's call, 2026-07-18): qrorder, DocQA, Marque, AutoShip.**
> One-prompt builds Dan doesn't stand behind. Don't link or mention them in proposals, the profile,
> or anywhere client-facing, even if the URLs still resolve. Proof arsenal = Oasi Kadir (+ review),
> sportmagaz.com.ua, consolline.com, Azulejo, Quextro, the OSS PRs, and the GitHub repos below.

## Web3 (in progress, Sept–Oct 2026; cite only what `web3.md` marks as live)
- **milestone-escrow** — USDC milestone escrow for Base in Solidity + Foundry: 80 tests (unit, fuzz, invariant, fork against real USDC), 100% coverage, Slither in CI. Public repo; not deployed yet, no demo yet. Links: see `web3.md`.
- **evm-ledger-indexer** — planned, not started; never cite.
- **effect-viem** — planned, not started; never cite.

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
- **E-commerce / storefront / catalog / PDP / filtering / marketplace browsing** → **sportmagaz.com.ua** (live, built solo, real store) + https://www.danolekh.com/p/sportmagaz + azulejo.danolekh.com + product-filtering-example.
- **Astro / marketing site / animation / WebGL / multilingual / Figma pixel-perfect** → **consolline.com** (live) + https://www.danolekh.com/p/consolline; add the Oasi Kadir numbers when speed matters.
- **Headless CMS / Strapi / multilingual site (incl. Astro)** → agriturismo.danolekh.com (live) + repo + Azulejo (Strapi blocks).
- **React/Next.js SaaS / dashboard / SSR** → Quextro (built solo, real users) + sportmagaz (Next.js 14 shop + admin) + Azulejo (TanStack Start SSR); consider a quick demo.
- **RAG / LLM / AI integration** → Quextro (LLM pipelines parsing exam papers, AI study assistant — built solo).
- **Payments / ordering / admin dashboards** → Quextro + the sportmagaz admin CMS for 2,000+ products
  (roles, orders, image manager). No live Stripe demo anymore — keep Stripe claims modest
  ("Stripe Checkout + webhooks") per `skills.md`; sportmagaz takes cash on delivery / bank transfer.
- **Rebuilds / no-source / legacy code** → the Oasi reverse-engineering story (minified WordPress
  bundle → 1:1 Astro rebuild) + the OSS PRs.
- **Cloudflare Workers / edge deploy** → Azulejo (Workers + Hyperdrive).
- **Data layer / Drizzle / Postgres** → Azulejo + drizzle-seeder repo.
- **Web3 / EVM / dapp / Solidity / indexer** → milestone-escrow (the only live web3 project: repo link, no address yet) + the iGaming money-correctness story in the past tense. The indexer and effect-viem join once `web3.md` marks them live.

## Deeper proof — Azulejo source
The full Azulejo codebase is local at **`~/code/terra-and-sol`**. When a job needs a specific
capability (e.g. variant modeling, faceted filters, Cloudflare/Hyperdrive, image pipelines, Strapi
blocks), open that repo to cite the exact files/approach in the proposal instead of speaking generally.

> Keep this list updated: every new win or deployed demo gets added here with a one-line "good proof for" note.
