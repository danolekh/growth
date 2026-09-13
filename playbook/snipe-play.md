# The Snipe Play — winning the OPEN gate

The funnel is `unopened → opened → shortlisted → messaged` (see `the-trust-gap.md` for the last
gate). This play attacks the FIRST gate, because a proposal that never gets viewed loses with a
perfect letter inside it. Three levers decide whether a client opens you, and none of them is the
letter body:

1. **Freshness** — clients read the first handful of proposals and often hire from them. By the
   time a post has 30 proposals, most letters are never opened (QR loss: 3 messaged out of 106).
2. **Slot position** — boosted proposals hold the top-4 slots in the client's list. On a fresh
   post the top-2 slots are usually cheap because nobody has found the job yet.
3. **Preview text** — before opening, the client sees ~2 lines of the letter + rate + JSS. Those
   two lines are the ad for the click.

Context: adopted 2026-07-22, after 13 straight applications with zero recorded views. Root cause
found the same day: every scraped hunt had come from the **best-matches feed** — stale, saturated
posts. The snipe play is the fix, funded by a $60 top-up (458 connects, the "last chance" budget).

## The rules

### Freshness rule
Only apply to jobs **< 60 min old** with **< 15 proposals** (ideal: < 5). A stale job is a skip
regardless of fit — the connects are worth more than the lottery ticket. This is enforced
mechanically: camp `upwork.com/nx/find-work/most-recent` and let the server's snipe filter
(`automation/snipe-config.json`) ping only on fresh matches.

### Slot rule
On every pursued snipe, **boost to hold a top-2 slot**. Bid just above the visible threshold
(capture live bids with the Boost Helper; mechanics in `connects.md`). On a fresh post the
auction is usually shallow — this is exactly when a boost buys the most visibility per connect.
Losing bids are refunded if the client never interacts. Skip the boost only when the auction is
irrational relative to the job's value.

### Preview rule
The first ~2 lines of the letter must carry the job-specific observation or the strongest proof —
no greeting, no "I read your post", no self-intro. Full guidance in `proposals.md` (HOOK). The
best preview line is about THEIR site or product, which is what the research step is for.

### Ration rule
**Max ~2 boosted snipes/day.** Budget math at 458 connects: a snipe costs ~15–25 to apply plus
~10–40 boost → ~25–60 all-in → **10–18 shots ≈ 2–3 weeks of runway.** Every shot must be a job
that scores high on `job-selection.md`; a ping from the filter is a candidate, not a verdict.

## The "make him need me" step (client research, 10 min cap)

Before drafting, on every pursue:

1. **Identify the client.** Extract company/product names, site URLs, screenshots, attachment
   filenames from the post. If googlable, WebSearch/WebFetch: what they sell, their stack (page
   source clues), recent launches, tone.
2. **Diagnose something real.** If a site URL exists and the job is perf/bug/rescue-shaped, run
   PageSpeed on THEIR site and pull 2–3 concrete findings. That becomes the preview line: their
   number, the two causes, and the Oasi 69→99 proof next to it.
3. **Tiered artifact:**
   - **Always:** findings woven into the letter (costs 5–15 min, reads like a free audit).
   - **$500+ and < 10 proposals:** a `/build-blog-demo` micro-demo on danolekh.com/b/ (2–3h cap).
   - **$1k+:** the full `/build-demo` play per `live-demo-play.md`.

The runbook (ping → triage → research → draft → boost → log) lives in
`automation/HUNT-WORKFLOW.md` §Snipe mode.

## The learning loop (non-negotiable)

The old failure wasn't just losing — it was learning nothing: 13 applications, zero outcome data.
Now every send gets logged in the proposal's `## Status / notes` block (bold labels — the
dashboard parses them into the Camping view's funnel strip), and at **+24h and +72h** Dan checks
the proposal's Insights panel on Upwork and records **Viewed / Messaged**.

### Stop-loss checkpoint
**After 8 logged sends, review the funnel** (dashboard ⛺ Camping → Funnel):
- **Still no views** → the open gate is still losing: check boost slots actually held, tighten to
  < 30 min post age and < 5 proposals, question the niche mix.
- **Views but no messages** → the battle has moved to the trust gate — this play worked; switch
  emphasis to `the-trust-gap.md` (de-risk offer in the first third, response speed, reviews).
- **Messages** → close per `client-comms.md`, bank the review, and write the case study.

Adjust before spending the second half of the war chest. Never ride a losing pattern to zero.
