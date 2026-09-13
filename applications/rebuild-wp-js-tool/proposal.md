# Application — Experienced JavaScript Developer Needed to Rebuild an Existing WordPress Tool

## Job
- **Title:** Experienced JavaScript Developer Needed to Rebuild an Existing WordPress Tool
- **URL:** https://www.upwork.com/jobs/Experienced-JavaScript-Developer-Needed-Rebuild-Existing-WordPress-Tool_~022078106443958756875/
- **Client signals:** Israel (Ramat Gan) · $102K spent · 75 hires · 94% hire rate · 5.0 ★ (45 reviews) · payment verified · member since 2017 · avg hourly paid $16.75
- **Budget & type:** hourly $20–40, Expert, <1 week, <30 hrs/wk. Post says they'll ask shortlisted candidates for an approach + timeline + **fixed-price quote** after sharing tool access.
- **Stack:** existing tool appears Angular-based, minified, source lost. Open to React / vanilla JS. Must stay WordPress-compatible (plugin integration).
- **Competition:** 50+ proposals (posted yesterday). 14 connects to apply.
- **Raw post:**
  ```
  We are an international premium musical instrument manufacturer looking for an experienced
  JavaScript developer to rebuild an existing interactive tool integrated into our WordPress
  website. The tool is currently functional, but its original source code is unavailable, and the
  existing production code is minified. We therefore need a developer who can assess the current
  implementation and either: Reconstruct it into clean, editable, maintainable source code; or
  Recreate the tool while preserving its current functionality and user experience. The current
  implementation appears to be Angular-based, but we are open to rebuilding it in React, vanilla
  JavaScript, or another suitable technology. The final solution must remain compatible with
  WordPress and allow for straightforward future development.

  Requirements:
  Strong JavaScript experience
  Experience with Angular and/or React
  Experience rebuilding or reimplementing existing web applications
  Familiarity with WordPress plugin integration
  Ability to produce clean, documented, maintainable code
  Good communication and ability to explain the recommended technical approach

  Full access to the existing tool and further details will be shared privately with shortlisted
  candidates. After reviewing it, we will ask you to propose an approach, estimated timeline, and
  fixed-price quote. Please include examples of similar reconstruction or reimplementation
  projects you have completed.
  ```

## Fit analysis (scored in automation/reports/hunt-2026-07-18T14-27-18-173Z.md — ranked #1 of 21)
- Skills fit: 4 — core work is JS/React (Dan's daily stack); WordPress surface is a thin
  plugin/shortcode enqueue; Angular only needs to be *read*, not written.
- Winnability: 4 — 50+ proposals hurts, but the ask ("explain your recommended approach" +
  "examples of reconstruction work") rewards exactly what Dan can show: merged PRs into codebases
  he didn't write + a review that literally says "he rebuilt our website".
- Value: 4 — short crisp scope, converts to fixed-price, dream review-writing client.
- Client quality: 5 — $102K spent, 94% hire rate, 45 × 5.0 reviews, verified, 9 years on platform.
- **Total / Verdict: 16 — pursue** (rescue-shaped rebuild, ideal review-banking client, no demo needed)

## Angle
- The hook: the Oasi Kadir 5.0 review, quoting the "rebuilt our website" + "problems I didn't even
  know we had" lines + case study link.
- De-risk hook: their own process is the de-risk — promise the written assessment + parity
  checklist + fixed quote after access, one day turnaround. One line noting the account is new
  with one completed contract.
- Client priority to mirror: clean/editable/maintainable code, preserved functionality/UX, and the
  ability to explain the recommended approach (they say it twice). So the proposal *contains* the
  recommended approach.
- Proof mapping: Oasi Kadir (rebuild + docs/handover praise), opentui PR #558 + code-racer (working
  inside existing codebases), product-filtering-example (17★ interactive TS tool, same shape as an
  embedded site tool).
- Honesty guardrails: do NOT claim Angular or WordPress plugin-dev experience (not in me/skills.md).
  Framing: Angular gets read during assessment; recommendation is React/TS recreation; WordPress
  integration stays a thin enqueue+shortcode wrapper.

## Demo plan
- Build or skip: **skip** — OSS PRs + review + filtering repo are the proof; tool is unseen anyway.

## Proposal draft (final — sent version below under "The text")

### The text

Hi!

On my last Upwork contract I rebuilt an existing website for an Italian agriturismo, and the 5.0
review the client left covers the part that matters for your tool: "he kept finding and fixing
problems I didn't even know we had... and he always came with the solution already worked out and
clearly explained. He also set everything up under our own accounts with full documentation, so we
own our infrastructure completely." The full write-up is here: https://www.danolekh.com/p/oasi-kadir

That project was the same situation you're describing. The old site was WordPress, the source code
was unavailable, and the production bundle was minified. I reverse engineered the components worth
keeping straight from that bundle - a parallax carousel, a card carousel and the menu animation -
and rebuilt them 1:1 in the new site, matching the original behavior exactly. So assessing minified
code and recreating its functionality without source is work I've done very recently. Along the
way the site also went from a 69 mobile PageSpeed score to 99, and from about 16 seconds to under 2.

You asked for examples of similar reconstruction or reimplementation work, and beyond the rebuild
above I regularly work inside codebases I didn't write: I have a merged PR in opentui, the terminal
UI library that opencode is built on, where I added text-selection features and fixed a viewport
bug in existing code (https://github.com/anomalyco/opentui/pull/558), and I was a top contributor
to the open-source code-racer project in 2023. And here's an interactive product-filtering tool of
mine in TypeScript, similar in shape to an embedded site tool:
https://github.com/danolekh/product-filtering-example

Since you want candidates who can explain their recommended approach, here's mine. I'd advise
against trying to reconstruct the minified Angular bundle back into source. De-minified code keeps
working, but the original names, structure and comments are gone for good, so it never becomes
genuinely maintainable. The reliable path is a faithful recreation, which is exactly how I handled
those carousel and menu components. First I map the live tool completely - every screen, input,
calculation, request and edge case - and turn that into a parity checklist you approve, so nothing
gets lost in the transition. Then I rebuild it in React (or plain TypeScript if it turns out to be
small) as a self-contained widget that mounts into a single div. Your current tool stays live the
whole time, and we only swap once the new one matches the checklist side by side.

On the WordPress side the integration stays thin: a small plugin that loads the new bundle and
exposes a shortcode, so the tool drops into any page and all future development happens in normal,
readable JavaScript source. Clean, documented code is the thing my one review so far praises most,
and I'm happy to be held to that standard here.

I'm newer on Upwork (one completed contract, the review above), so I keep this low-risk for you:
once you share access, I'll come back within a day with the written assessment, the recommended
approach, a timeline and a fixed-price quote, exactly as you describe. You commit to the rebuild
only if the quote makes sense.

I'm fully available now and can start on the assessment today. My rate is $35/hr for that stage,
and then we move to the fixed price we agree on.

Happy to answer any questions about the approach.

Daniil

## Price / timeline / milestones
- Rate bid: **$35/hr** (upper-mid of $20–40) for the assessment; fixed quote after access per
  their stated process.
- Timeline: assessment ≤1 day after access; rebuild estimated ~1 week (matches their "<1 week").
- Structure once fixed: 50/50 (parity build in staging / swapped live + documented source handover).

## Apply settings (finalized at apply screen, 2026-07-18)
- Apply cost: **14 connects** → 216 remaining (balance 230 confirmed on screen).
- Boost: **SKIP** — live top-4 auction was 80/82/83/84 cn ("bid 85 to lead") ≈ $12+. Far past the
  ≤15cn review-banking cap; irrational auction for a <1-month hourly job. Won on proof instead.
- Rate: **$35/hr** (override the $20 profile-rate default). No scheduled rate increase (<1 month job).
- Preferred-qualification miss shown to client: **Earnings ≥ $10,000** (Dan: $2,530). Proceeded
  anyway — the cover letter's de-risk paragraph addresses the thin track record head-on.
- "Describe your recent experience with similar projects" field: condensed proof answer leading
  with the same-situation fact (old oasikadir.it = WordPress, no source, minified bundle →
  reverse-engineered parallax carousel, card carousel, menu animation, rebuilt 1:1) + opentui PR +
  code-racer + product-filtering-example.
- Attachment: Resume - no contacts.pdf. Profile highlights: Oasi Kadir Upwork job + portfolio items.
- ⚠️ Apply screen showed "Reactivate Freelancer Plus" + a **10% service fee** — the Plus plan
  (0% fee, per me/connects.md) appears to have lapsed. Worth reactivating before the next contract.

## Status / notes
- **Sent:** 2026-07-18 (balance 230 → 216)
- **Bid:** $35/hr
- **Boost:** none (auction 80–84cn, irrational)
- **Connects spent:** 14 apply
- **Viewed:**
- **Messaged:**
- **Hired:**
- **Client replies:**
- **Next step:** after access is shared, deliver the written assessment + parity checklist + fixed quote
  within a day, as promised.
