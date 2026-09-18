# Skills & Tech Stack

Use this to match a job's requirements to concrete, honest claims. Only claim what's here.

## Languages
- **TypeScript** (primary — daily, deep)
- Python
- Zig (hobby / systems interest)

## Frontend
- **React** (incl. React 19), **Next.js** (14, App Router)
- **Astro** (static + SSR, content-driven sites; React islands; 4-locale i18n at consolline.com;
  the static re-platform of sportmagaz.com.ua)
- **Tailwind CSS** (strong)
- **TanStack Start** (full-stack React SSR), TanStack Router / Query / Form
- Zustand (state), Radix UI / Base UI (accessible primitives), embla-carousel
- Responsive design, accessible navigation, i18n routing
- **View Transitions** (Astro `ClientRouter`): shared-element transitions where the product photo
  morphs from the card into its page, persisted header (sportmagaz.com.ua)
- **WebGL2 shaders for UI effects** (consolline.com): an interactive globe (cobe-based, WebGL1
  fallback, scroll and drag velocity, paused off-screen) and a pointer-reactive halftone dot field
- Scroll-driven UI without an animation library: sticky pinned sections, rAF-smoothed progress,
  CSS-animation timers; framer-motion / motion where a library fits
- Build-time text measurement with fontkit to size headlines per language with no layout shift

## Backend / Runtime
- **Node.js**, **Bun**, **Express** (production microservices, 2026), Hono
- **Effect.ts** (production at Quextro: typed errors, layers, effects as values)
- **Event-driven services**: domain events between services, idempotency keys, rate limiting,
  session revocation flows (iGaming platform, 2026)
- REST APIs, server-side rendering, webhooks
- **tRPC** (sportmagaz.com.ua shop, 2024)
- **next-auth**: credentials for staff roles, Google OAuth and email magic links for customers
- Validation with **Zod**

## Data
- **PostgreSQL**, SQLite
- **Redis** (ioredis in production: counters, rate limits, daily flags, alert dedupe)
- **Drizzle ORM** (no heavy CMS wrappers — comfortable hand-rolling data layers; variants/SKUs/attributes modeling)
- **Supabase** — extensive, across many client projects (confirmed by Dan 2026-09-15): Postgres with
  row-level security policies, Supabase Auth (email + OAuth providers), Storage for uploads, Edge
  Functions, Realtime subscriptions; schema via the Supabase CLI and migrations, generated
  TypeScript types. Knows when plain Postgres + Drizzle is the better call. Add project names here
  when Dan supplies them; until then messages say "a good number of client projects", no names.
- Object storage (Cloudflare R2 / S3-compatible) + image pipelines (sharp, blurhash); S3 presigned
  uploads with per-product folders and cropping (sportmagaz admin)

## CMS
- **Custom-built admin CMS** (Next.js, sportmagaz.com.ua, 2,000+ products): admin and product-editor
  roles, specs editor, Tiptap rich text, S3 image manager, categories, brands, homepage blocks, orders.
- **Strapi** — production experience: deployed on Railway with Postgres + object storage bucket, i18n (multi-locale), role-based access (Admin/Editor), public read-only API permissions, content modeling from provided schemas.

## DevOps / Infra
- **Vercel** (frontend, auto-deploy from GitHub, preview URLs)
- **Cloudflare Workers** (Wrangler, Hyperdrive Postgres acceleration)
- **Railway** (Strapi + Postgres + buckets)
- Docker / containerization
- CI/CD via **GitHub Actions** (ESLint + TypeScript checks on push) and **GitLab CI** (2026 platform work)
- OpenTelemetry (observability)
- AWS

## EVM / Web3 (hands-on since September 2026; see `web3.md` for what is live)
- **Solidity 0.8** basics: custom errors, events, a per-job state machine, OpenZeppelin (SafeERC20, ReentrancyGuard), ERC-20 approve/transferFrom with balance-delta checks, USDC (6 decimals); no upgradeability tricks
- **Foundry**: unit and fuzz tests, invariant tests with handlers, fork tests against real USDC, coverage, deploy scripts; Slither in CI
- **Base Sepolia**: deploy from an encrypted keystore, Basescan (Etherscan v2) source verification
- Not claimed yet (planned; claim only once `web3.md` lists the address, demo or repo): Base mainnet deploys, viem / wagmi v2 wallet-connected frontends, event indexing and reorg handling
- Not claimed: production contract experience beyond the public repos, audits, Solana/Rust, MEV, ERC-4337

## Domain / Other
- **Reverse engineering existing frontends** — recreating functionality 1:1 from minified production
  bundles with no source available. Proven on the Oasi Kadir rebuild: the old oasikadir.it was
  WordPress with a minified bundle and no source; reverse-engineered the parallax carousel, card
  carousel, and menu animation from it and reimplemented them 1:1 in the new site.
- LLM integration (e.g. extracting questions & topics from PDF exam papers)
- SEO (meta, Open Graph, JSON-LD structured data), 90+ performance scores
- Internationalization (IT/EN; uk/en/pl/ru at consolline.com)
- E-commerce (sportmagaz.com.ua: custom storefront + admin CMS for 2,000+ products, attribute filters
  with live "+N" counts; Azulejo)
- Ukrainian e-commerce integrations: Nova Poshta API (city and branch lookup), Telegram bot order
  alerts, Google Merchant product feed
- Monorepos (Turborepo)
- Figma-to-code precision: pixel-diff verification against Figma frames, overflow sweeps across routes
  × widths, copy audits against the client brief (consolline.com, 4 locales)
- iGaming domain: wallets, ledgers, bonuses, GEO/compliance rules (2026)
- Testing: Vitest + Testing Library
