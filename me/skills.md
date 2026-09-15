# Skills & Tech Stack

Use this to match a job's requirements to concrete, honest claims. Only claim what's here.

## Languages
- **TypeScript** (primary — daily, deep)
- Python
- Zig (hobby / systems interest)

## Frontend
- **React** (incl. React 19), **Next.js** (14, App Router)
- **Astro** (static + SSR, content-driven sites)
- **Tailwind CSS** (strong)
- **TanStack Start** (full-stack React SSR), TanStack Router / Query / Form
- Zustand (state), Radix UI / Base UI (accessible primitives), embla-carousel
- Responsive design, accessible navigation, i18n routing

## Backend / Runtime
- **Node.js**, **Bun**, **Express** (production microservices, 2026), Hono
- **Effect.ts** (production at Quextro: typed errors, layers, effects as values)
- **Event-driven services**: domain events between services, idempotency keys, rate limiting,
  session revocation flows (iGaming platform, 2026)
- REST APIs, server-side rendering, webhooks
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
- Object storage (Cloudflare R2 / S3-compatible) + image pipelines (sharp, blurhash)

## CMS
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
- **Solidity 0.8** basics: custom errors, events, OpenZeppelin (SafeERC20, ReentrancyGuard), no upgradeability tricks
- **Foundry**: forge tests, fuzz and invariant tests with handlers, fork tests, deploy scripts, Basescan (Etherscan v2) verification
- **viem / wagmi v2** in wallet-connected frontends (injected, Coinbase Wallet, WalletConnect), TanStack Query for chain state
- **Event indexing**: viem getLogs/getBlock, reorg handling with block-hash cursors, idempotent ingestion, reconciliation against balanceOf
- **Base** (Sepolia + mainnet) deploys; USDC (6 decimals) handling
- Not claimed: production contract experience beyond the public repos, audits, Solana/Rust, MEV, ERC-4337

## Domain / Other
- **Reverse engineering existing frontends** — recreating functionality 1:1 from minified production
  bundles with no source available. Proven on the Oasi Kadir rebuild: the old oasikadir.it was
  WordPress with a minified bundle and no source; reverse-engineered the parallax carousel, card
  carousel, and menu animation from it and reimplemented them 1:1 in the new site.
- LLM integration (e.g. extracting questions & topics from PDF exam papers)
- SEO (meta, Open Graph, JSON-LD structured data), 90+ performance scores
- Internationalization (IT/EN and beyond)
- E-commerce (custom storefronts, admin panels for 2000+ products, dynamic filtering)
- Monorepos (Turborepo)
- Figma-to-code precision: pixel-diff verification against frames (Consolline, 14 routes × 3 locales)
- iGaming domain: wallets, ledgers, bonuses, GEO/compliance rules (2026)
- Testing: Vitest + Testing Library
