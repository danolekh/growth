# Connects — current state

> **2026-09-13:** balance **213 connects**, Plus active. **Rule: no more top-ups, no boosts** (Dan's
> call). 213 ≈ 10-14 unboosted sends. Spend only on fresh (< 24h) fixed-price $200-800 jobs from the
> most-recent feed, or hourly $30+ with < 15 proposals. Second client = JSS; that is the prize.

Dynamic state. The newest `../automation/inbox/hunt-*.json` `connectsBalance` is authoritative if
more recent than the date below; otherwise update this file manually. Decision framework lives in
`../playbook/connects.md`.

- **Plan:** ⚠️ Plus showed **LAPSED** on the first two 2026-07-18 apply screens ("Reactivate" +
  10% fee). The voice-AI apply screen later that day no longer showed the banner but still listed a
  10% fee — Dan may have reactivated (and the old "0% fee" perk may simply be gone). **Confirm.**
- **Balance:** **417 connects** (2026-07-22 11:38Z camp capture, after the AI Workflow SaaS send:
  21 apply + 20 boost from 458). The 458 was the post-top-up war chest ($60, "last chance");
  ration per `../playbook/snipe-play.md`: max ~2 boosted snipes/day, ~25–60 connects all-in each
  → 10–18 shots ≈ 2–3 weeks of runway.
  - Prior reading: 184 (2026-07-18, Webflow-bug apply screen, pre-submit). Consistent with the
    pro-services send costing 26 apply + 62 boost from 272 → the boost bid was charged (top-4 held
    or client interacted). Earlier mystery: balance jumped 196 → 287 after the Lovable send —
    unexplained top-up of ~91 (Plus reactivation / refresh / purchase?). **Ask Dan.**
- **Unit cost:** ~$0.15 / connect (top-ups).

## Quick read
- 458 connects ≈ **$69** of buying power, refreshed +100/mo.
- This is the snipe-play budget: every spend should be a **fresh job (<60 min, <15 proposals)
  boosted to a top-2 slot** per `../playbook/snipe-play.md`. Stop-loss: review the funnel after
  8 logged sends.

## Recent spend (proposals)
| Date | Job | Demo | Rate bid | Apply | Boost | Balance after |
|---|---|---|---|---|---|---|
| 2026-07-22 | AI Workflow SaaS MVP (React/Next/Node, snipe @4min, <5 proposals) — **status unclear: 41 cn spent (→417 in captures) then refunded (→458 on next apply screen). Withdrawn? Job closed? Ask Dan** | none (Quextro + Azulejo proof) | $30/hr | 21 | bid 20 | 417 → refunded |
| 2026-07-22 | Next.js + Headless CMS, Sanity-preferred (snipe @3min, <5 proposals) — SENT, qual-banner (Americas/$10K) | none (agriturismo + Azulejo proof) | $35/hr rec ($30 pre-typed, confirm) | 20 | bid 6 (2nd place) | 432 confirmed |
| 2026-07-18 | React PWA bug fixing (Lovable farmers-market app) — pending send | none (Oasi numbers + OSS PRs) | $30/hr | 10 | **bid 7** (4th place at 6; skip the 55–56 war) | ~140 expected if boost charged |
| 2026-07-18 | Webflow API bug fix (URGENT, hiring today) — SENT, boost charged | none (honest no-Webflow angle: Strapi APIs + OSS PRs + review) | $30/hr field, $150 fixed offered | 15 | bid 12 (charged) | 157 confirmed |
| 2026-07-18 | Pro-services site: lead intake + AI + admin ($1,700 fixed) — SENT, boost charged | none (Oasi review + Azulejo) | $1,700 fixed (340/340/680/340) | 26 | bid 62 (charged — held top-4 or client interacted) | 184 confirmed |
| 2026-07-18 | Rebuild minified JS tool (WordPress) — instrument mfr | none (OSS PRs + review) | $35/hr | 14 | none (auction 80–84cn, irrational) | 216 |
| 2026-07-18 | Lovable AI app builder → backend (Polsia-style) | none (qrorder + docqa links) | $30/hr | 20 | none (auction 55–72cn) | 196 |
| 2026-07-18 | Voice AI weekend launch (Cat) | none (marque + azulejo + qrorder) | $40/hr field, $1,200 fixed quote | 26 | none (auction 51–58cn) | 261 |
| 2026-07-18 | AI chatbot → lead records ($150 fixed) — pending send | none (Quextro + review; proposal reworked after demos retired) | $150 flat | 11 | **bid 10** (auction 5–9cn, review-banking carve-out) | ~240 expected |
| 2026-06-04 | Sr. Next.js Design System Eng — Barber Booking | barber-ds.danolekh.com (+/storybook) | $48/hr | 27 | none (steep auction, top-4 at 150+ cn) | 365 |
| 2026-05-31 | Front-End Dev — Premium Car Dealership (Marque) | marque.danolekh.com | $32/hr | 10 | none (81-cn floor, $0/unverified client) | 160 |
| ~2026-05-30 | Full Stack Dev — E-commerce analytics (Pulse) | pulse.danolekh.com | $24/hr | 26 | none | ~170 |
| ~2026-05-29 | Developer — DTC + B2B Ops (ApparelOps) | apparelops-meridian.netlify.app | $30/hr | 26 | none | ~196 |

> Balances before the dealership row are approximate (reconstructed from apply costs); update from
> the next hunt's `connectsBalance` when available.
