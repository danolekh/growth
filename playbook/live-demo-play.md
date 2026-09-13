# The Live-Demo Play

The signature move. Building a working demo **before applying** is what hooked Ashraf:

> "The demo you built caught my attention, I like the initiative."

It proves capability instantly, shows initiative, and removes the client's risk. Most applicants
send words; Dan sends a working URL on the client's exact stack.

## The play, step by step
1. **Find the single highest-impact deliverable** in the post. Usually the most visible one —
   "landing page in Astro", "dashboard", "product listing page". Pick ONE, not the whole project.
2. **Build it on the client's exact stack.** Oasi Kadir wanted Astro + Tailwind + Vercel → that's
   what Dan used. Matching the stack signals "I can execute *your* project," not just "I can code."
3. **Use the job's real content** where possible — their business name, their copy, their vibe.
   It makes the demo feel built *for them*, not a generic template.
4. **Deploy to a subdomain** under danolekh.com (pattern: `<project-slug>.danolekh.com`, e.g.
   `agriturismo.danolekh.com`). A live link >> screenshots >> descriptions.
5. **Lead the proposal with the link** (see `proposals.md` → HOOK).
6. **Offer the source repo when asked** — transparency closes the trust gap (Dan shared
   `github.com/danolekh/agriturismo` on request and it sealed the deal).

## When to run it
- Scope is **concrete** and a few hours yields something genuinely impressive.
- The **stack matches** Dan's skills.
- The job is **winnable and the client is worth a review** — gate on winnability + client quality,
  not raw budget. A small crisp job from a good client can justify a quick demo in the
  profile-building phase; a big budget with a vague brief doesn't.
- A visual/interactive deliverable exists (front-end, page, dashboard).

## When to skip it
- Scope is huge, ambiguous, or backend-only with nothing to *show*.
- Unwinnable or bad-client job — the hours only pay off if they end in a review.
- **Performance / site-rescue jobs (the niche lane): don't build anything.** The "demo" already
  exists — the Oasi Kadir before/after (69→99, 16s→<2s), the 5.0 review, and
  https://www.danolekh.com/p/oasi-kadir. Lead with those; speed-to-apply matters more than a
  fresh artifact.
- A demo can't capture the real value (e.g. data pipeline, infra, integration glue).
- In those cases, lead with the most relevant existing project/repo instead.

## Reusable starting point
- Clone & customize **`github.com/danolekh/agriturismo`** for Astro/Tailwind/CMS-style site demos —
  it's already structured cleanly with commented components and is the fastest path to a new demo.
- Dan builds and deploys the demo himself; this workspace plans *what* to build and drafts the
  proposal that wraps around it.

## Variant: the blog-page micro-demo (danolekh.com/b/)
A lighter, faster form of the play: instead of a whole app on a `<slug>.danolekh.com` subdomain, build
a small **interactive demo embedded in a blog post on danolekh.com** that solves the client's *exact*
stated problem, and lead the proposal with that link. First used in the "crop" proposal
(`/b/exact-retailer-url-from-a-photo`) and the lawyer doc-indexing job
(`/b/index-documents-with-claude`).

- **When to use it vs. a full subdomain demo:** use the blog micro-demo when the client's need is a
  single focused interaction — a specific extraction, algorithm, lookup, or pipeline step (e.g.
  "resolve a retailer URL from a photo", "pull author/date/subject from a document"). Use a full
  `<slug>.danolekh.com` app when the deliverable is product-shaped (storefront, dashboard, multi-page
  flow). The micro-demo is hours not a day, and it doubles as portfolio content on his
  own site.
- **How it's built** (repo `~/code/danolekh`, TanStack Start on Cloudflare):
  - `src/content/b/<slug>.md` — frontmatter + a short writeup in Dan's voice, embedding the component
    with a fenced ` ```demo:<name> ` block.
  - `src/components/demos/<name>.tsx` — the interactive component, in his zinc theme.
  - `src/lib/demos/<name>.ts` (+ a `*-resolve`/`*-extract` server fn) — live logic via
    `createServerFn`, reading secrets from `cloudflare:workers` `env`, with an **in-memory cache over a
    fixed allow-list of samples + a committed fixture fallback** so it always renders and can't be
    abused for cost. Model the `flow-contents` trio of files.
  - Register the component name in `src/lib/content/blog-components.tsx`.
  - Secrets: `.dev.vars` (gitignored) for local dev; `wrangler secret put <NAME>` for prod.
  - Deploy: `pnpm run deploy` (needs Cloudflare auth — `wrangler login` or `CLOUDFLARE_API_TOKEN`).
- **Optional design step:** write an image-gen prompt for the ideal UI, generate a reference image,
  then recreate it faithfully in his theme tokens (how the doc-index demo was built).
- **Proposal style:** lead with the live link, then explain the reasoning concisely and name the
  cost/trade-offs (what you'd cut, what it costs at scale). The "crop" and doc-index proposals are the
  models.

## How Claude helps here
When a job is tagged *pursue-with-demo*, Claude should: name the one artifact to build, list the
key sections/components, suggest which real content from the post to use, and note the target
subdomain — so Dan can build + deploy fast.
