# Case Study — Oasi Kadir (first Upwork win, completed 2026-07-17, 5.0 ★)

The canonical reference. Future proposals are modeled on what worked here. **Contract completed:**
$2,530 total, a detailed 5.0 review, and the numbers that anchor the performance-rescue niche —
**mobile PageSpeed 69 → 99, load time ~16s → under 2s**. Public write-up:
https://www.danolekh.com/p/oasi-kadir

## The job
- **Client:** Ashraf Salem — Italian agriturismo (farm stay) with hotel, restaurant, events near Rome.
- **Ask:** Build the hotel website frontend in **Astro + Tailwind**, backed by **Strapi CMS**.
  Client provided wireframes, 16 Strapi content models, all content (IT+EN), photos, brand assets,
  and a Scidoo booking embed. *"We are NOT looking for a designer. You execute."*
- **Scope:** Strapi setup (Railway/DO, i18n, media, roles, content), Astro frontend (4 page
  templates, Tailwind, Strapi API, booking embed, responsive, SEO, i18n routing, accessible nav),
  deployment (Vercel auto-deploy, Strapi webhook → rebuild, custom domain/SSL, README docs).
- **Hard requirement:** maintainable, commented, readable code. *"If we cannot read it, the
  project has failed."*
- **Budget/timeline:** €1,000–1,500 fixed, milestone-based, 4–6 weeks.
- **Client signals at posting:** new-ish (0 reviews; ended up spending $2,530), but **crisp scope**
  and **responsive** — the combination that made it worth pursuing.

## Why Dan pursued it
Clear scope + assets ready + exact stack match (Astro/Tailwind/Strapi) + demo-able landing page.
Textbook green-flag job per `../playbook/job-selection.md`.

## What won it

1. **Live demo, unprompted.** Dan built and deployed a sample landing page at
   `agriturismo.danolekh.com` (Astro + Tailwind + Vercel) *before applying* and led with the link.
   → Client: *"The demo you built caught my attention, I like the initiative."*
2. **Mirrored the priority.** Client obsessed over readable/commented code → Dan's proposal
   included a real, well-commented `RoomCard.astro` component.
3. **Answered every requirement** — Strapi prod on Railway (Postgres + bucket), i18n IT/EN,
   Cloudinary/S3 media, Admin/Editor roles, read-only public API.
4. **Structured milestones with prices** → Client: *"This is exactly the kind of structured
   approach I was looking for."*
5. **Mid-budget price + immediate availability.**
6. **Flexibility** — agreed instantly to a 1-week bug-fix buffer after M4.
7. **Transparency** — shared the demo repo (`github.com/danolekh/agriturismo`) on request.

## The numbers
- **Price:** $1,300 (budget was €1,000–1,500). Timeline: 3–4 weeks + 1-week buffer.
- **Milestones (20/20/40/20):**
  - M1 — Strapi setup & content architecture (~wk1) — $260 (20%). 16 content types, i18n, roles, read-only API.
  - M2 — Content population & API layer (~wk2) — $260 (20%). Astro scaffold, API utils, i18n routing, base layout, booking embed.
  - M3 — Page templates built (~wk3) — $520 (40%). All 4 pages from wireframes, responsive, live data.
  - M4 — Polish, SEO, deploy & handover (~wk3–4) — $260 (20%). Meta/OG/JSON-LD, webhook→rebuild, domain/SSL, README, handover call.

## Reverse engineering (under-told part of the story — use for rebuild/no-source jobs)
The old **oasikadir.it was a WordPress site with no source code available and a minified production
bundle** — the same situation as any "rebuild our tool, source is lost" post. Dan reverse engineered
the components worth keeping straight from the minified bundle — the **parallax carousel, card
carousel, and menu animation** — and reimplemented them **1:1** in the new Astro site. Cite this
whenever a job involves assessing minified/legacy code or recreating functionality without source.

## Delivery style that built trust
- Short **video walkthroughs** each milestone + written summaries.
- Shared **Strapi admin credentials** and **Vercel preview URLs** so the client could explore.
- Proactively **asked for assets** (real email, Scidoo URL, logo) without blocking own progress
  (seeded test data to keep moving).
- Restructured to a **Turborepo monorepo** for maintainability; set up **GitHub Actions CI**
  (ESLint + TS checks).
- Surfaced a gap honestly: only the homepage wireframe was provided, so Dan asked for the other
  three rather than guessing — and offered to proceed in the homepage's style if unavailable.

## Outcome — completed 2026-07-17
- **Contract ended 2026-07-17. Total paid: $2,530 fixed** (quoted $1,300; scope grew through the
  styling round, hosting-compliance fixes, and a DNS-conflict migration — extras quoted fairly,
  several smaller features included without renegotiating).
- **The headline result: mobile PageSpeed 69 → 99, load time ~16s → under 2 seconds.** These numbers
  are the flagship proof for the performance-rescue lane in `../playbook/job-selection.md` — quote
  them in every speed/rescue proposal.
- **First completed job + first review on the platform (5.0/5)**, with all five client endorsements:
  Collaborative, Committed to Quality, Solution Oriented, Clear Communicator, Accountable for Outcomes.
- **Public write-up:** https://www.danolekh.com/p/oasi-kadir — link it in proposals as the case study.

### The review (verbatim — quote from it freely)
> "Working with Daniil was a great experience from start to finish. He rebuilt our agritourism
> website with Next.js and Strapi and went well beyond the original scope, always in the interest of
> the project. What impressed me most is that he kept finding and fixing problems I didn't even know
> we had, like hosting compliance issues and DNS conflicts during the migration, and he always came
> with the solution already worked out and clearly explained. The results are real: our mobile speed
> score went from 69 to 99 and the site now loads in under 2 seconds instead of 16. He communicates
> clearly, sends structured updates after every session, gives fair quotes and included several
> smaller features without renegotiating. He also set everything up under our own accounts with full
> documentation, so we own our infrastructure completely. He treated the project like it was his own.
> I will definitely work with him again and recommend him without hesitation."

(The review says "Next.js" — the build is actually Astro + Strapi; the client misremembered the
stack. Dan's own materials say Astro; don't "correct" the review, just describe the stack accurately
in proposals.)

## Transferable lessons → see `../playbook/proposals.md`
Demo-first, mirror priorities, answer every requirement, structured milestones, mid-budget,
flexible, transparent, communicate proactively.
