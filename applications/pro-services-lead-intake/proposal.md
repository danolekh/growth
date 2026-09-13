# Application — Professional Services Website with Interactive Lead Intake, AI Integration, and Owner Dashboard

## Job
- **Title:** Full-Stack Next.js Developer Needed: Professional Services Website with Interactive Lead Intake, AI Integration, and Owner Dashboard
- **Job URL:** https://www.upwork.com/jobs/Professional-Services-Website-with-Interactive-Lead-Intake-Integration-and-Owner-Dashboard_~022078432590656214734/
- **Client signals:** not shown on apply screen (verify on job page: spend / reviews / payment verified)
- **Budget & type:** $1,700 fixed, "Expert" level, 3–4 weeks, less than a month
- **Stack:** Next.js (App Router) + TypeScript, Tailwind + shadcn/ui, Supabase or Neon Postgres, Vercel AI SDK, Clerk/Auth.js/Supabase Auth, Cal.com/Calendly embed, Vercel hosting
- **Raw post:**
  ```
  We are a professional services firm looking to hire a skilled full-stack developer for a
  one-time, fixed-price project to build our corporate website.

  We already have our custom domain and all written content ready. This website will not sell
  products or process online payments. Instead, its primary goal is to introduce our services,
  interactively capture high-quality client requests, and allow immediate meeting scheduling.

  We require a premium, polished user interface for clients and a secure, highly user-friendly
  owner dashboard where we can monitor incoming requests and update basic site status settings
  with zero coding.

  1. Public Facing Website (Premium Corporate Look)
  - Clean, minimalist, responsive corporate design (desktop + mobile).
  - Implementation of our provided text, sections, and brand content.
  - Blistering fast load speeds optimized for Google SEO performance.

  2. Interactive Client Portal & Smart Lead Intake Form
  - Intuitive multi-step form for contact details and company information.
  - Dynamic Service Interaction: form dynamically adapts follow-up questions to the selected service.
  - AI Integration: smart text field via Vercel AI SDK (OpenAI or Anthropic) that generates a
    concise summary + technical category tags as the client types.
  - Meeting Scheduling: Cal.com or Calendly embed on the final step.

  3. Private Owner Dashboard (/admin Portal)
  - Secure admin login (Clerk, Auth.js, or Supabase Auth).
  - Master data table of incoming requests with service-specific data.
  - Sort, filter, status dropdown (New, Meeting Scheduled, Archived).
  - Settings view to update simple site variables (phone, email) without code.

  Stack: Next.js (App Router) & TypeScript, Tailwind CSS & shadcn/ui, Supabase or Neon,
  Vercel AI SDK, Vercel (connected to our GitHub repository).

  Deliverables: production deploy on custom domain, clean well-commented code in their private
  GitHub repo (100% ownership), Markdown instruction doc (env vars, DB backup, AI key swap),
  14-day post-launch bug support.

  Budget: $1,700 fixed. Timeline: 3–4 weeks. Asks for portfolio links showing custom web apps,
  secure dashboards, or Next.js projects.
  ```

## Fit analysis (rubric from ../../playbook/job-selection.md, rate 1–5)
- Skills fit: 5 — the preferred stack is literally Dan's default stack (Next.js App Router, TS, Tailwind/shadcn, Postgres, Vercel). LLM integration proven at Quextro. Zod-driven dynamic forms, admin tables, auth all in `me/skills.md`.
- Winnability: 4 — crisp, well-written scope with assets ready (the Ashraf pattern). But the boost auction is hot (top 3 at 105–107 connects), signalling heavy competition.
- Value: 4 — $1,700 fixed at fair scope, plus a review-banking opportunity on a clean hand-off job.
- Client quality: 3–4 (unverified from apply screen; the post quality itself is a strong signal — they know exactly what they want).
- **Total / Verdict:** pursue — near-perfect stack fit, well-scoped, speed + ownership priorities mirror the Oasi review verbatim.

## Angle
- The hook: Oasi Kadir numbers (69→99 mobile PageSpeed, 16s→<2s) + the 5.0 review line about setting everything up under the client's own accounts with full docs — mirrors their "one-time hand-off, 100% ownership" priority.
- De-risk hook: one line after the hook — milestone-based, approve each stage before paying.
- Client's stated priorities to mirror: (1) blistering fast / SEO, (2) zero-coding owner dashboard, (3) effortless one-time hand-off with full ownership + docs.
- Best-mapping proof: Oasi Kadir (speed + hand-off + review), Quextro (LLM pipeline, founding engineer, dashboards), Azulejo (custom web app, Postgres/Drizzle, live link).

## Demo plan
- Skip — the review numbers + Azulejo live link carry it; the scope is too broad for a quick focused demo and the auction favors applying fast.

## Proposal draft

Hi,

On my last Upwork contract I took a client's website from a 69 mobile PageSpeed score to 99, and from 16 second loads to under 2 seconds. Their 5.0 review states those numbers, and it also covers the thing that matters most for a one-time hand-off like yours: "He set everything up under our own accounts with full documentation, so we own our infrastructure completely." Full case study: https://www.danolekh.com/p/oasi-kadir

My Upwork profile is still young, so I keep things low-risk: milestone-based payments where you approve each stage before it's paid.

Your preferred stack is what I use by default anyway: Next.js App Router with TypeScript, Tailwind with shadcn/ui, managed Postgres on Supabase or Neon, deployed on Vercel from your GitHub repo. Nothing in your list is new ground for me.

How I'd build each piece:

For the public site, I'd implement your provided content in clean, responsive sections and keep pages statically rendered wherever possible, which is how you get the fast loads and Core Web Vitals scores Google rewards. Speed is the thing I'm best known for, per the review above.

For the intake form, a multi-step flow where the selected service determines which follow-up questions appear. I'd define each service's follow-up fields as a schema, so the form adapts instantly on selection and validation stays airtight on both client and server (Zod).

For the AI field, the Vercel AI SDK calling an LLM (OpenAI or Anthropic, your choice) in the background as the client types, debounced, producing a concise summary plus category tags that are saved with the request. I've built this exact kind of structured extraction before: at Quextro, an ed-tech platform used by British teachers and students, I built the core LLM pipeline that extracts questions and topics from exam papers.

For scheduling, a Cal.com embed on the final step, linked to the submitted request so you can see who booked.

For the owner dashboard, secure login with Clerk or Supabase Auth, a master table of all requests including their service-specific answers, with sorting, filtering, and a status dropdown (New, Meeting Scheduled, Archived). The Settings view lets you edit site variables like the contact phone and email, stored in the database and live on the site immediately, zero code involved.

For hand-off, everything lives in your GitHub repo and your accounts from day one, the code is commented and readable, and I'll write the Markdown guide covering environment variables, database backups, and swapping AI keys. The 14-day post-launch support period is included.

Since you asked for portfolio links: besides the case study above, https://azulejo.danolekh.com/ is a custom Next-style web application I built and maintain (React SSR, Postgres, image pipelines), and at Quextro I built the entire platform solo as founding engineer, including its admin dashboards.

Price is $1,700 fixed as posted, split into four milestones:

Milestone 1, public website (week 1) - $340. Your content implemented, responsive, deployed to a Vercel preview URL you can click.

Milestone 2, smart intake form (week 2) - $340. Multi-step flow with dynamic per-service questions and the Cal.com booking step.

Milestone 3, AI integration + owner dashboard (week 3) - $680. The AI summary and tagging field, admin login, the request table with statuses, and the Settings view.

Milestone 4, polish + launch (week 4) - $340. Performance and SEO pass, custom domain hookup, the documentation, and handover. The 14-day support window starts here.

I'm available now and can start today.

Daniil

## Price / timeline / milestones
- Price: $1,700 fixed (the posted budget, quoted in full — well-scoped Expert post, don't discount)
- Timeline: 4 weeks + 14-day support window
- Milestones: 20/20/40/20 → $340 / $340 / $680 / $340
- Duration dropdown: 1 to 3 months (4 weeks + 14-day support crosses a month)

## Apply settings
- Apply cost: 26 connects → 246 remaining after submit (balance 272 pre-submit)
- Boost: **bid 62** — just above the 4th-place bid of 61. ≈ $9.30 at risk, refundable if the slot
  isn't held and the client never interacts. Worth it on a $1,700 high-fit job. Do NOT chase the
  105–107 war for the top-3 slots.
- Profile highlights: add the Oasi Kadir Upwork job + Azulejo portfolio piece (up to 4 slots).
- Attachment: "Resume - no contacts.pdf"

## Status / notes
- **Sent:** 2026-07-18 (per connects log: SENT, boost charged — held top-4 or client interacted, balance 184 confirmed)
- **Bid:** $1,700 fixed (340/340/680/340)
- **Boost:** bid 62 cn (charged)
- **Connects spent:** 26 apply + 62 boost
- **Viewed:**
- **Messaged:**
- **Hired:**
- **Client replies:**
- **Next step:** log Viewed/Messaged from the Insights panel
