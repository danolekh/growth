# Work Experience

Source of truth for proposals. Pull the most relevant role for each job. In messages, never
present Renewator as a current job: write about it as recent contract work in the past tense and
name the company only if asked for references (see `workflow/DJINNI-WORKFLOW.md`). Public dates
for it read **"2026"** on resumes and LinkedIn, never "present" (Dan's call, 2026-09-17).

## Renewator — Software Engineer, contract (since Aug 2026; public dates "2026")
- Event-driven **Node.js microservices for a live iGaming platform** (identity, gateway, wallet,
  bonus, casino, notification): **Express + Drizzle ORM + PostgreSQL + Redis**, Docker, GitLab CI.
- Shipped **per-brand GEO access rules end to end**: schema, the shared decision function, gateway
  counters, monitoring alerts on threshold crossings, admin CRUD and the React admin UI.
- **Money-correctness work:** idempotent withdrawals keyed on the ledger index, single-statement
  bonus expiry with debit, abuse limits on bonus issuance, campaign dry-run calculation with
  per-user exclusion reasons.
- **Auth hardening:** strict rate limits on login/register aliases, session-revocation events on
  password change/reset consumed by the gateway.
- Built **[consolline.com](https://consolline.com) solo in Astro** (Aug–Sep 2026), the site of an
  international logistics company: **4 languages** (uk/en/pl/ru), 148 static pages, 85 components,
  about 1,650–1,950 translation keys per language, React islands on Base UI.
  - **Custom WebGL2 shaders, no animation library:** a globe (cobe-based, WebGL1 fallback) tuned to
    the Figma node that drifts, takes a push from scroll and hands drag velocity back on release, paused
    off-screen; a halftone dot field that the pointer pushes around.
  - **Scroll-driven sections:** sticky pinned rails, a timeline with rAF-smoothed progress, a case
    rail whose auto-advance timer is a CSS animation (hover pauses it with no JS), number-flow counters.
  - **No layout shift across languages:** display headlines sized at build time with fontkit
    ("МІЖНАРОДНА" measures 1238.72px against 1239 in Figma); a language switch carries scroll, tabs,
    carousel positions and form values into the new page.
  - **Checked against the design:** pixel diffs against Figma frames, an overflow sweep with 0 clipped
    elements across 14 routes at 320/375/430px, all 151 lines of the client's copy brief audited on the
    rendered page, dead in-page links 15 → 0.
  - Case study: https://www.danolekh.com/p/consolline
  - Not claimed: the deploy pipeline (GitLab CI, Helm, the IIS handover) and the base pixel-diff
    scripts. Teammates built those; the Astro site itself is Dan's.
- Best proof for: backend/Node, Postgres + Redis in production, event-driven systems, working inside
  a multi-dev codebase with code review, Astro + i18n, animation-heavy front ends (WebGL2, scroll),
  Figma-to-code precision.
- Terms: ~10 h/week, one 10-minute daily call. Found via Djinni (TeGem post) 2026-08-06.

## Freelance (Upwork) — Full-Stack Developer (Jan 2026 – Aug 2026)
- **Oasi Kadir** (agriturismo, Italy): rebuilt the site on **Astro + Tailwind + Strapi** (i18n IT/EN,
  role-based CMS access, Vercel + Railway). **Mobile PageSpeed 69 → 99, load ~16s → under 2s**,
  5.0 review, $2,530 contract. Case study: https://www.danolekh.com/p/oasi-kadir
- **Reverse-engineered** the parallax carousel, card carousel and menu animation from the old
  site's minified WordPress bundle (no source) and reimplemented them 1:1.
- Found and fixed hosting-compliance and DNS issues unprompted; full handover docs; client owns
  all infrastructure.
- Best proof for: Astro, headless CMS, performance rescue, migrations, client communication.

## Quextro — Founding Engineer (Dec 2024 – Dec 2025)
- Built the entire platform **solo**: backend in **Bun + Effect.ts + Drizzle ORM**, frontend in **React 19 + TanStack Router**.
- Developed the **core LLM algorithm** that extracts questions and topics from PDF exam papers.
- Owned full **CI/CD, Docker containerization, and OpenTelemetry observability** on AWS/Railway.
- Impact: the product is **used by many British teachers and students today**.
- Best proof for: solo ownership end-to-end, complex product work, LLM features, modern React.

## Sportmagaz (sportmagaz.com.ua) — Freelance Full-Stack Developer (May 2024 – Dec 2024)
Listed as "iFit" in older files; the real, live store is https://sportmagaz.com.ua.
- Built and deployed **[sportmagaz.com.ua](https://sportmagaz.com.ua) solo**, a sports-equipment
  store selling across Ukraine: **Next.js 14 (App Router) + tRPC + Drizzle ORM + PostgreSQL** in a
  Turborepo monorepo (shop, separate admin app, 12 shared packages), 65 merged PRs.
- **Custom admin CMS for 2,000+ products** (cms.sportmagaz.com.ua, Next.js): admin and
  product-editor roles, product editor with specs, videos, copy and on/off, nested categories,
  brands, homepage blocks, order statuses, S3 image folders with presigned uploads and cropping,
  Tiptap rich text.
- **Filtering:** a generic attribute model (class / boolean / range values), per-category filter
  options built in SQL, live "+N" counts next to each option.
- **Orders the Ukrainian way:** Nova Poshta city and branch lookup at checkout, confirmation emails to
  the customer and the admin, Telegram order alerts. Auth for customers via Google OAuth or email
  magic link (next-auth).
- Achieved **90+ Real Experience Score** and consistent organic SEO traffic: JSON-LD (Product,
  Store, breadcrumbs), dynamic sitemap, a Google Merchant product feed.
- **Re-platformed in 2026** (Jul–Aug): static **Astro** + React islands on **Cloudflare Workers**,
  **view transitions** where the product photo morphs from the card into the product page (header
  persists across pages), an **Effect** checkout worker that recalculates prices on the server, a
  rebuild on publish from the CMS plus a 10-minute job for expired sales, and SEO metadata checked
  against the old site before cutover.
- Case study: https://www.danolekh.com/p/sportmagaz
- Best proof for: e-commerce, custom admin/CMS, catalog filtering, Next.js, Astro re-platforms,
  view transitions, SEO, Ukrainian delivery integrations, freelance delivery.

## Radency — Software Engineer (2023 – 2024)
- Optimized a **multi-tenant system (React, Express, Firebase) serving 10,000+ active users**.
- Built internal **Vue/NestJS tools and custom Chrome extensions** used daily by the HR department.
- Best proof for: scale, optimization, working within an existing team/codebase, breadth of stacks.

## Education
- **BSc Computer Science** — Taras Shevchenko National University of Kyiv (expected 2026).

## Location
Vienna, Austria since September 2026 (EU time zone). Ukrainian FOP for invoicing; displaced-person
ID (free Austrian labour-market access) from 2026-09-21.

## Notes for proposals
- "Founding engineer who shipped a real product solo" is a strong, credible line — use it.
- Real user numbers (10,000+ users; 2,000+ products at sportmagaz.com.ua; British teachers/students) are concrete and persuasive — cite them.
- Name the live sites. "I built sportmagaz.com.ua on my own" and "I built consolline.com on my own"
  are clickable proof; the case studies are at danolekh.com/p/sportmagaz and danolekh.com/p/consolline.
