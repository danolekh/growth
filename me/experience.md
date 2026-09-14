# Work Experience

Source of truth for proposals. Pull the most relevant role for each job. In messages, never
present Renewator as a current job: write about it as recent contract work in the past tense and
name the company only if asked for references (see `workflow/DJINNI-WORKFLOW.md`).

## Renewator — Software Engineer, contract (Aug 2026 – present)
- Event-driven **Node.js microservices for a live iGaming platform** (identity, gateway, wallet,
  bonus, casino, notification): **Express + Drizzle ORM + PostgreSQL + Redis**, Docker, GitLab CI.
- Shipped **per-brand GEO access rules end to end**: schema, the shared decision function, gateway
  counters, monitoring alerts on threshold crossings, admin CRUD and the React admin UI.
- **Money-correctness work:** idempotent withdrawals keyed on the ledger index, single-statement
  bonus expiry with debit, abuse limits on bonus issuance, campaign dry-run calculation with
  per-user exclusion reasons.
- **Auth hardening:** strict rate limits on login/register aliases, session-revocation events on
  password change/reset consumed by the gateway.
- Separately, an **Astro marketing site for a logistics operator**: 14 routes × 3 locales (uk/en/pl),
  pixel-matched against Figma with measured diffs, static build served by nginx.
- Best proof for: backend/Node, Postgres + Redis in production, event-driven systems, working inside
  a multi-dev codebase with code review, Astro + i18n, Figma-to-code precision.
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

## Freelance — Fullstack Developer (May 2024 – Dec 2024)
- Delivered a **full e-commerce platform from scratch** using **Next.js 14 + Drizzle ORM** (no CMS wrappers).
- Built a **custom admin panel for 2000+ products**, dynamic filtering, and **role-based auth**.
- Achieved **90+ Real Experience Score** and consistent organic SEO traffic.
- Best proof for: e-commerce, custom admin/CMS, performance, SEO, freelance delivery.

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
- Real user numbers (10,000+ users; 2000+ products; British teachers/students) are concrete and persuasive — cite them.
