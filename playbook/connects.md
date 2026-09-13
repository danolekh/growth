# Connects & Boosting — the spend decision

Connects are Upwork's currency for submitting proposals. They cost real money, so every proposal is
a spend decision: *should I apply at all, and should I boost?* This is the framework. Dan's current
balance/plan live in `../me/connects.md`.

## Mechanics (2026)
- **1 connect ≈ $0.15.** Dan is on **Freelancer Plus**: 100 connects/month, $19.99, 0% service fee.
- **Applying** costs **2–6 connects** for standard jobs, and **commonly ~16–18 for expert / high-value
  posts** (confirmed live). Upwork shows the exact cost on each job ("Send a proposal for N Connects").
- **Boosting = a 7-day auction for the top 4 proposal slots.** You set a **max bid** (extra
  connects). The boost screen shows the **live top-4 bids** and tells you the exact amount to lead —
  these can run high on contested jobs (e.g. a real auction seen at top-4 = 56/57/60/61, "bid 62 to
  lead"). The 4 highest bids hold the slots.
- **You pay your full bid only if** you hold a top-4 slot at the auction's end **or** the client
  interacts with your boosted proposal. Otherwise the boost connects are **refunded**.
  → Pay-your-bid, but with a refund safety net, so the *downside of a losing boost is small*.

Don't memorize prices — Upwork shows live cost and bid range in-app. This doc is about the *call*.

## Decision 1 — apply at all?
Only spend connects on jobs that clear `job-selection.md` (verdict *pursue* or *pursue-with-demo*).
A healthy balance is not a reason to apply to low-fit jobs — connects discipline protects both money
and focus. Skip = a valid, valuable answer.

## Decision 2 — boost? (default: opportunistic)
**Boost when most/all of these hold:**
- High **fit** + high-value client (good budget, verified, real spend/reviews).
- The post is **fresh / few proposals** — an early top slot is the best visibility-per-connect you'll
  ever get.
- Dan has a clear **differentiator** to capitalize on the extra eyeballs — above all a **live demo**
  (the Ashraf combo) or exact-stack proof.
- There's **real competition** (enough proposals that organic placement would bury you).

**Skip the boost when:**
- **Low budget** — the boost math rarely works on small gigs; win those on **speed + proof** instead
  (apply within the first hours, lead with the 69→99 review numbers). *Profile-building carve-out:*
  a modest boost (≤ ~15% of the contract value, so ≤ ~$45 on a $300 job ≈ up to ~20 connects) is
  acceptable when it clearly secures a review-banking job from a new client — the review's value
  isn't in the invoice.
- **Little competition / very fresh with few proposals** — you may already surface organically.
- **Weak fit** — don't pour connects into a long shot.
- The visible **bid range is irrational** vs. the job's value (a bidding war not worth winning).

## Decision 3 — how much to bid?
- It's **pay-your-bid for a top-4 slot**, so **bid just above the visible 4th-place threshold** —
  enough to claim a slot, not a vanity overbid.
- **Cap by ROI.** Boost cost in $ ≈ `0.15 × connects`. Keep it a small fraction of
  `expected contract value × the uplift in win-probability` boosting buys. Examples:
  - Boost **6–12 connects ≈ $0.90–$1.80** at risk (refundable if you don't hold a slot / no client
    interaction). Trivial against a **$1,000+** contract → **boost freely** on high-fit, high-value,
    fresh posts.
  - A **$100–200** fixed gig → usually **don't boost** on pure ROI — unless the job is a clean
    review-banking pick (new client, crisp scope, niche-lane fit) and a few connects visibly secure
    it; then the review justifies a small bid.
- Because losing bids get refunded (no client interaction), lean toward **bidding to win** on jobs
  Dan genuinely wants rather than timid underbidding — the realized cost only lands when it worked.

## The winning combo
**Live demo + boost-to-top on a well-scoped, high-fit job.** That's the Ashraf pattern — see
`live-demo-play.md` and `../case-studies/oasi-kadir.md`. The boost buys the eyeballs; the demo
converts them.

## How Claude uses this
- During triage (`../automation/HUNT-WORKFLOW.md`): for each *pursue* pick, state the **apply cost**,
  the **current balance** (from the hunt's `connectsBalance` or `../me/connects.md`), and a
  **preliminary boost call** (boost / maybe / no).
- At apply time, when Dan captures live boost data (a `../automation/boost/*.json` snapshot or a
  pasted bid range): recommend a **specific bid** — just above the visible threshold, ROI-capped.
