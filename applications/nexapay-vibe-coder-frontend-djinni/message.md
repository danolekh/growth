# Djinni application message — Nexapay

English (post is in English).

## Message (send this)

You're asking for live links, so here are three: sportmagaz.com.ua, a sports-equipment store I built and deployed solo with its own admin CMS, consolline.com, an Astro site for a logistics company in four languages with a custom WebGL2 globe and halftone effect, also solo, and azulejo.danolekh.com, a TanStack Start storefront. I use Claude Code daily on real feature work and review everything it writes, so the AI-assisted half of what you're asking for is already how I build.

On the UI side, consolline was checked pixel by pixel against the Figma frames before launch, headlines are sized at build time so nothing shifts across the four languages, and the globe and dot-field effects are hand-rolled WebGL2, no animation library. That's the kind of polish I aim for over something that reads as templated.

On the backend and API side, I recently shipped Node microservices for a live iGaming platform: wallet, bonus and notification services on Express and Drizzle, with idempotent withdrawals keyed on the ledger and Postgres and Redis behind them. That's the same idea behind "really understanding what you're building" in your post - I designed the schema and business logic behind those APIs myself, including wallet balances, bonus expiry and withdrawal idempotency.

Two honest gaps against your nice-to-haves: I haven't worked inside a payment gateway, and I haven't touched card processing or USDC settlement directly. My security experience is auth hardening, rate limits on login and session revocation on password change, from the iGaming work above.

Based in Vienna, an hour behind Estonia, so a 9 to 7 window works fine for me. Happy to send more repos or do the test task whenever it's useful.

Portfolio: danolekh.com · GitHub: github.com/danolekh

## Screening answers

**Share a link to the best website or interface you have personally built using AI tools. It must
be your own work, built by you from start to finish — not a team project or a template. Please
briefly describe it.**

consolline.com - I built this solo, from an empty repo, using Claude Code throughout. It's the
site of an international logistics company: Astro, 4 languages (uk/en/pl/ru), 148 static pages.
The parts I'm proudest of are hand-rolled, no animation library: a WebGL2 globe that reacts to
scroll and hands back drag velocity on release, a halftone dot field the pointer pushes around, and
headlines sized at build time so nothing shifts layout across languages. I checked it pixel by
pixel against the Figma frames before launch. Case study: danolekh.com/p/consolline.

## Form settings
- **Salary expectations:** $2,000. No visible band, EU product company, so this is the standard ask.
- **Resume:** `me/resume/out/Resume-frontend.pdf`
- **Timing:** posted today, only 5 applications so far and flagged hot. Send this one first.
