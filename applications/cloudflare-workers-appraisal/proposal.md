# Backend/API Developer - Cloudflare Workers + API Integrations (Collectibles Appraisal Tool)

- **Job:** https://www.upwork.com/jobs/Backend-API-Developer-Cloudflare-Workers-API-Integrations-Collectibles-Appraisal-Tool_~022078267521481090571/
- **Verdict:** pursue (score 16) - camp capture 2026-07-18 18:49, best stack fit of the day
- **Budget & type:** $2,500 fixed envelope, starts with a small paid milestone
- **Connects:** unknown (tile-only capture, confirm on apply screen)
- **Strategy:** answer their live-bug screening question concretely, lead with Workers + Anthropic API daily use, quote Milestone 1 crisply.

## Cover letter

Hi!

Your stack is my daily stack. I run a production storefront on Cloudflare Workers (with Hyperdrive for Postgres): https://azulejo.danolekh.com - TypeScript end to end, and I work with the Anthropic API every day, which should help since Claude powers your appraisal front end.

You asked how I'd diagnose an API returning empty fields when auth looks correct. First I'd reproduce the call with raw curl outside the Worker to rule out anything in our code. Then I'd run the same request with a basic-tier key next to the advanced-tier key and diff the responses, and log the raw upstream body before any mapping touches it. In my experience this pattern is usually per-field entitlement gating on the provider side, so your subscription-tier suspicion sounds right. The value I'd add is proving it, and then making the Worker surface that condition clearly so it never fails silently again.

On the eBay 503: that smells like an inactive or unapproved App ID, and one thing worth knowing is that the Finding API is legacy at this point, so part of the fix may be migrating that call to the Browse API. I'd confirm before touching anything.

On my last Upwork contract I worked with a non-technical owner, explained everything in plain terms, and got a 5.0 review for it: https://www.danolekh.com/p/oasi-kadir

For Milestone 1 I'd propose $350: both live bugs diagnosed and fixed (or root-caused with a written finding if the fix sits on the provider's side), plus a resilience review of the Worker with timeouts and fallbacks, in 3 to 4 days. Phase 3 honesty: I haven't built eBay or Shopify bulk-listing exports before, but they're documented CSV and REST work, and I'd scope them milestone by milestone with you.

Available now. I'm fine with 5-10 hours a week ongoing after the trial.

Daniil

## Screening answers

- Cloudflare Workers examples: Azulejo (Workers + Hyperdrive), covered in letter
- E-commerce/marketplace API experience: own storefront + Stripe; eBay/Shopify honestly flagged as new but documented territory
- Empty-fields diagnosis approach: covered in letter
- Availability next 4-6 weeks: available now, 5-10 hrs/wk fits

## Apply settings

- Rate: Milestone 1 at $350 fixed, then per-phase milestones toward $2,500
- Boost: no - 18h old, win on proposal quality
