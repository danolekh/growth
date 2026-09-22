# UK Growth Agency — Astro + Cloudflare Landing-Page Developer

- **Source:** Upwork · https://www.upwork.com/jobs/~022102094379456325165
- **Posted:** 22 Sep 2026. Views/applications at draft time: unknown (Upwork detail fetch failed,
  `detail_error: email-only`; scored on the RSS/email summary only).
- **Company:** unnamed in the post. A UK growth agency that builds productised, founder-led
  marketing landing pages for clients (VSL, qualification form, Calendly booking), running paid
  Meta traffic into them.
- **Budget:** Hourly, up to $75/hr. More than 6 months, ongoing work if it goes well.
- **Format:** Remote, UK-hours overlap wanted ("a few hours"). Commercial structure: a short paid
  takeover of the existing repo first, then client builds.
- **Language:** English.

## Raw post (abridged)
Take over and continue an existing landing-page system: one master Astro (TS/JS) template,
deployed on Cloudflare Pages/Workers with custom domains and DNS, GitHub for source control, a
custom admin/CMS layer for duplicating pages, GoHighLevel (GHL) for CRM/forms/webhooks, Calendly
for booking, Meta Pixel + Conversions API with browser/server dedupe, GA4 + Microsoft Clarity +
UTM attribution, Wistia for video (Cloudflare Stream under consideration).

Immediate work: a short paid technical takeover confirming how the Astro build, CMS, Cloudflare
deploy, DNS, env vars, GHL, Calendly and tracking fit together. Then clone-and-configure client
builds: hero, VSL, logo strip, testimonials, case studies, FAQs, a multi-step qualification form
that writes to GHL with correct field mapping, routes qualified/review/unqualified applicants,
shows Calendly only to qualified applicants, and fires one deduplicated Meta conversion event on a
confirmed booking (not a calendar click). Everything ships to staging first; QA across
Chrome/Safari/FB-in-app-browser, Core Web Vitals, no regressions on other client pages, a
deployment note and rollback path per launch.

Wants: strong Astro/component-based frontend, Cloudflare Pages/Workers/DNS/env vars, GitHub
workflows, API/webhook integration, GHL or comparable CRM, Calendly embeds, Meta Pixel + CAPI,
GA4/Clarity/UTM, responsive conversion-focused pages, staging discipline, clear non-technical
communication.

## Requirements → Dan
| They want | Dan |
|---|---|
| Astro, component-based frontend | **Yes.** Astro is a primary tool: sportmagaz.com.ua re-platform, consolline.com (148 pages, 4 locales), Oasi Kadir |
| Cloudflare Pages/Workers, DNS, env vars, deploy troubleshooting | **Yes.** sportmagaz.com.ua runs on Cloudflare Workers (Wrangler, Hyperdrive), rebuild-on-publish worker; Oasi Kadir included a live DNS/SSL migration |
| GitHub repos, branches, deploy integrations | **Yes.** GitHub Actions CI on every project, 65 merged PRs on the sportmagaz monorepo alone |
| Headless CMS / admin layer for duplicating content | **Yes**, shape matches: Strapi in production (i18n, roles, webhook rebuild) and a custom Next.js admin CMS built from scratch (sportmagaz, 2,000+ products) |
| API and webhook integrations | **Yes**, generally: webhook-driven rebuilds, event-driven services with idempotency and dedupe logic (iGaming platform work) |
| GoHighLevel or comparable CRM | **Gap.** Never used GHL specifically |
| Calendly embeds + booking-event handling | **Gap.** No Calendly integration shipped |
| Meta Pixel + Conversions API, browser/server dedupe | **Gap.** No Meta ads tracking shipped |
| GA4, Clarity, UTM attribution | **Partial.** Comfortable with analytics wiring and JSON-LD/SEO metadata; no GA4/Clarity system built end to end |
| Wistia | **Gap.** Never used |
| Staging-first, QA discipline, deployment notes, rollback | **Yes.** Standard practice on every project (Vercel previews, CI checks, handover docs at Oasi Kadir) |
| Clear communication with non-technical stakeholders | **Yes.** Structured update cadence proven at Oasi Kadir (video walkthroughs + written summaries), 5.0 review cites it |

## Stack-ability
Ongoing hourly work with a UK client, "a few hours" overlap, not a full-time seat. Stacks fine
next to job1. The paid takeover-first structure is low-risk on both sides.

## Verdict
**Apply.** The core dev stack (Astro, Cloudflare, GitHub, headless CMS, webhook/event-driven
backends) is a near one-to-one match and the hottest part of Dan's proof set. The gap is real and
specific: GoHighLevel, Meta CAPI and Calendly are marketing-ops tools he has never touched, even
though the underlying skill (mapping webhook payloads into a system, deduping events) is exactly
what he does on the iGaming platform work. Name the gap plainly, lead with the Cloudflare/Astro
match, and offer a time-boxed rate for the takeover phase rather than overcommitting to unfamiliar
tools at a senior rate.
