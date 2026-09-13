---
name: triage-job
description: Score a single Upwork job against Dan's profile and decide pursue / pursue-with-demo / skip, with the apply-cost and a boost call. Use when Dan pastes ONE job description (or asks "should I apply to this?", "is this worth it?", "what do you think of this one?"). For a whole feed of jobs, use the bulk hunt workflow in automation/HUNT-WORKFLOW.md instead.
user-invocable: true
---

# triage-job — qualify a single job

Decide, honestly, whether Dan should spend connects on this job. A sharp "skip" is a valuable answer —
connects discipline protects money and focus.

## Read first (the knowledge base)
- `playbook/job-selection.md` — the green/red flags + 1–5 scoring rubric + early-stage strategy.
- `playbook/connects.md` and `me/connects.md` — the spend/boost framework + current balance.
- `me/skills.md` — only count honest stack matches.
- `me/experience.md`, `me/portfolio.md` — what Dan can prove and lead with.
- `playbook/the-trust-gap.md` — why young-profile proposals stall, for the winnability read.

## Steps
1. **Score 1–5** on Skills fit, Winnability, Value, Client quality using the rubric — **apply its
   "CURRENT PHASE" (profile-building) weighting**: Value = review-per-effort, sweet spot $200–800
   fixed with crisp scope, and the **niche priority lane** (site speed / Core Web Vitals /
   Lighthouse / migration / rescue) gets +1 Winnability — the Oasi Kadir 69→99 review is the demo.
2. **Verdict + one-line reason:** `pursue` · `pursue-with-demo` · `skip`.
   - Total ≥ 15 and no dimension = 1 → pursue (pursue-with-demo if a quick demo lifts winnability).
   - Niche-lane job, total ≥ 12 and no dimension = 1 → pursue (lead with the review numbers, no demo).
   - 10–14 → pursue only with a sharp angle or quick demo.
   - < 10 or any hard red flag → skip (incl. stale + saturated: 3+ days old, 40+ proposals, no hire).
3. **Connects call:** state the **apply cost** (`connectsRequired`, or note it's unknown/tile-only),
   the **current balance** (from `me/connects.md` or the hunt's `connectsBalance`), and a **boost call**
   (boost / maybe / no) per `playbook/connects.md`. If Dan pasted the live boost auction, recommend a
   **specific bid** just above the 4th-place threshold, ROI-capped — and skip the boost when the bid
   range is irrational vs the job's value (a $15–30/hr job with a 200-connect top-4 is not winnable by
   boost).
4. **Rate hint:** mid-to-upper of the stated budget, justified by fit.
5. If pursue / pursue-with-demo, **offer the handoff**: `/write-proposal`, and `/build-demo` (product-
   shaped deliverable) or `/build-blog-demo` (single focused interaction) when a demo is warranted.

## Rules
- Be specific to THIS post; never generic. Only credit skills in `me/skills.md`.
- Read competition from `proposalsRange` + `activity.interviewing`; tile-only data means confirm cost at
  apply time, don't invent client stats.
- Honour the trust gap: a clear scope + responsive client beats a big budget with a vague brief.
