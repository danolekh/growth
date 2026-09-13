# Company Operating System (Greenville Home Exteriors ops/job-costing app)

- **Job:** https://www.upwork.com/jobs/Company-Operating-System-Development_~022079924415105931921/
- **Captured:** 2026-07-22T13:42Z (snipe mode) · posted 2 min before capture · proposals unknown (open to confirm)
- **Client:** USA · payment verified · $6K+ spent · (tile-only, rating/history not shown)
- **Budget:** hourly $30–50 · Expert · Less than 1 month, <30 hrs/wk
- **Stack:** React + TS + Tailwind + TanStack Router (built in Lovable) · Supabase (Postgres + RLS, Auth, Storage, Edge Functions) · QuickBooks + Google Calendar · SheetJS/jszip

## Cover letter

Your stack is almost exactly what I build in. Azulejo (https://azulejo.danolekh.com) is a React app I built on TanStack Router and Query with a Postgres data model - categories, products, variants and SKUs, attributes - which is the same shape as your catalog, supplier prices, and SKU crosswalk. I work in Postgres daily and I've extended Lovable-built React apps before, so getting into your codebase would be quick.

Since this is an existing app I'd be improving rather than a greenfield build, how I work matters: I read the code and the data model carefully before changing anything. A couple of my merged open-source PRs show that, clean self-contained changes in someone else's codebase (https://github.com/anomalyco/opentui/pull/558 and github.com/webdevcody/code-racer/pull/698).

On the specifics: React, TypeScript, Tailwind, and TanStack Router are my daily tools. Your ~35-table Postgres model is the kind of relational modeling I enjoy and do well - Azulejo's catalog with SKUs as the shared key across variants and suppliers is close to your products, supplier_prices, and item_crosswalk. I'm comfortable with the QuickBooks and Google Calendar API integrations and with the SheetJS and jszip Excel and zip parsing.

To be straight with you: my backend depth is in Postgres itself - schema design, RPCs, SQL views - rather than Supabase's specific wrappers. I haven't shipped a Supabase RLS-heavy app, so I'd ramp on the RLS policies, supabase-js patterns, and Edge Functions on the first pass. The underlying Postgres is my strength, so that ramp is short, and I wanted to flag it upfront.

Since I'm still building up my Upwork profile, I'd suggest starting with a scoped first piece, an audit of the current app plus one feature or fix, so you can see how I work before we go further. My rate is $40/hr, I'm available now, and I can start right away.

Looking forward to hearing more, and to seeing the full brief and data model.

## Status / notes

- **Verdict:** pursue (snipe) — best skills-alignment of the session
- **Score:** 16/20 (Skills 4, Winnability 4, Value 4, Client 4)
- **Freshness:** 2 min old at capture; proposals not shown — confirm on apply screen (should be very low)
- **Rate bid:** $40/hr (client range $30–50; mid)
- **Apply cost:** open to confirm (tile-only)
- **Boost:** recommend a top-2 slot — capture live bids with the Boost Helper; a 2-min post should be a shallow auction
- **Why strong:** Azulejo IS this stack (TanStack Router/Query + Postgres, complex SKU/variant data model); Dan uses TanStack Router daily (rare among competitors) and has extended Lovable-built apps; OSS PRs prove clean work in an existing codebase (this is an audit/improve job, not greenfield)
- **Honesty note:** upfront that Postgres is the strength but Supabase-specific RLS/supabase-js/Edge Functions are a short ramp — trust-building, not overclaiming
- **Ration note:** would be a boosted send today. Higher conviction than the SaaS-licenses draft — if picking one more to send, this is the stronger one (verified client, exact stack, better rate)
- **Sent:** (pending)
- **Viewed:** (check +24h / +72h)
- **Messaged:** (check +24h / +72h)
