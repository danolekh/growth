# Application — AI web developer: finish, design and launch a voice AI product (Cat)

> ⚠️ **Historical record.** The sent text below cites docqa, marque and qrorder, which Dan retired
> as proof on 2026-07-18 (never cite again — see me/portfolio.md). If Cat replies, lean on Azulejo,
> Quextro, the Oasi review and the war-room agent setup; don't re-link the retired demos.

## Job
- **Title:** AI web developer: finish, design and launch a voice AI product
- **Job URL:** https://www.upwork.com/jobs/web-developer-finish-design-and-launch-voice-product_~022078367288474050762/
- **Client signals (hunt 2026-07-18):** $33K spent · 105 reviews × 4.9 ★ · verified · hires
  constantly ("hired many freelancers here over the years", group with several products)
- **Budget & type:** hourly listing, Expert, 1–3 months, <30 hrs/wk — but the post says **fixed
  price in milestones**, quote for full scope. Weekend launch (start Sat, done Sun/Mon). 26 connects.
- **Stack:** Vapi + Twilio (5 countries) + Stripe webhook + Supabase + Loops + Vercel; plain
  HTML/JS frontend (no framework); Claude Code maintenance agent as a core deliverable; NDA after
  hire; keys in env vars only.
- **Raw post:** (full text in hunt-2026-07-18T14-27-18-173Z.json, job "voice AI product"; apply
  screen paste 2026-07-18. Key asks: 1) link to a shipped voice AI build, 2) two design links,
  3) 1–2 lines on the maintenance agent setup, 4) weekend hours + fixed price + milestone split.)

## Fit analysis (hunt report rank #3, score 15 — pursue)
- Honest gap: **no shipped Vapi build** (hard "About you" item). Report's call: say it plainly,
  this client smells fluff; the rest of the plumbing is proven daily stack.
- Design bar: marque + azulejo clear it. Stripe/Supabase/Vercel: qrorder is near-verbatim proof of
  scope item 6. AI-assisted dev + agent setup: Dan's strongest differentiator (the war room itself).
- Value: modest weekend fee but a 4.9×105 client who reviews everything + monthly continuation.

## Angle
- Hook: candor + coverage. Open with "almost all of this is my daily stack" and name the Vapi gap
  in the first paragraph, before she finds it. Then design links (her filter), qrorder (her
  milestone 2), and the maintenance-agent answer grounded in how Dan actually operates (Claude Code
  + self-documenting workspace).
- De-risk: her own milestone structure + the 5.0 review; one line, not groveling.
- Mirror: "premium, warm, trustworthy" design; "I keep full control" (everything in her accounts,
  documented); honesty about weekend hours (she asks explicitly).

## Demo plan
- Skip — weekend job, live links carry it.

## Proposal draft — final text

Hi Cat!

Almost everything in your scope is my daily stack: Stripe webhooks, Supabase, Vercel and Claude
Code are what I work with every day. I'll be straight about the one gap up front: I haven't
shipped a production Vapi build yet, so for your first question the honest answer is that I don't
have one to show. The closest is https://docqa.danolekh.com, an AI product I built on the Claude
API. The Vapi work in your scope (loading the 11 prompts, configuring voices and accents,
bridging the Twilio numbers) is provisioning through a well-documented API, and that kind of
integration work is what I do constantly. If the Vapi requirement is firm, fair enough - here's
why I think I'm still the right hire for this weekend.

For the two design links: https://marque.danolekh.com is a premium used-car dealership site I
designed and built, and https://azulejo.danolekh.com is a handcrafted-ceramics storefront. Both
are consumer-facing, mobile-first, and made to feel like polished brands. I'm comfortable working
in plain HTML and JavaScript, and technical SEO basics like canonical tags and per-page meta are
standard in how I build.

For the backend wiring, https://qrorder.danolekh.com is live and already does most of your
milestone 2: real Stripe checkout with a signature-verified webhook that idempotently creates the
paid record in Supabase, plus realtime status for the user afterwards. Your version swaps in a
subscriber record, the Vapi whitelist call and the Loops trigger - the same wiring pattern. Keys
live in environment variables only there too, which I saw is a firm rule for you and is how I
always build.

On the maintenance agent: I'd set up Claude Code in your repo with a CLAUDE.md documenting the
whole system (pages, env vars, deploy flow, the Vapi/Twilio/Stripe/Supabase/Loops map) plus small
runbook files for routine tasks like updating copy, adding a persona, or redeploying, so you open
Claude Code and direct it yourself with everything in your own accounts. I actually run my own
freelance operation exactly this way, as a self-documenting workspace of docs and playbooks that
Claude Code executes, so this deliverable is the part of your scope I know best.

Last week I finished my first Upwork contract with a 5.0 review
(https://www.danolekh.com/p/oasi-kadir); the client wrote that I kept finding and fixing problems
he didn't even know he had, always with the solution already worked out. I'm newer on Upwork, and
your milestone structure keeps this low-risk anyway: you approve each stage before paying.

Regarding the weekend, I'm fully available and can commit around 12 hours on Saturday and 12 on
Sunday, starting as soon as I'm hired. Happy to sign the NDA before receiving access.

My fixed price for the full scope is $1,200, using your suggested split: $480 for milestone 1
(redesigned site live plus all 11 agents configured in production), $360 for milestone 2
(payments and backend wiring), and $360 for milestone 3 (tested go-live across all five
countries plus the maintenance agent set up and documented). If the launch goes well I'd be glad
to continue month to month, working with the agent we set up.

Daniil

## Price / timeline / milestones
- Rate field on the hourly listing: **$40/hr**. Fixed quote in letter: **$1,200** (40/30/30 on
  her own 3-milestone structure). Weekend: ~24h committed.

## Apply settings (finalized at apply screen, 2026-07-18)
- Apply cost: **26 connects** → 261 remaining (screen shows 287 before submit).
- Boost: **SKIP** — auction 51/55/56/57 ("58 to lead"); per the hunt report the honest-angle bet
  either lands with this client or it doesn't; boost doesn't fix the Vapi gap.
- Attachment: Resume - no contacts.pdf. Highlights: Oasi Kadir job + marque/azulejo/qrorder items.
- Balance note: 287 pre-apply vs 196 after the Lovable send — a top-up happened (likely Plus
  reactivation / monthly refresh; the "Reactivate" banner is gone from this screen, though the fee
  still shows 10%). Confirm with Dan and reconcile me/connects.md.

## Status / notes
- **Sent:** 2026-07-18 (confirmed by balance 287 → 261 on the next apply screen)
- **Bid:** $40/hr field + $1,200 fixed quote
- **Boost:** none (auction 51–58cn)
- **Connects spent:** 26 apply
- **Viewed:**
- **Messaged:**
- **Hired:**
- **Client replies:**
- **Next step:** if hired, ask for the status file + docs first, then sequence: site redesign Sat AM,
  Vapi/Twilio Sat PM, Stripe/Supabase/Loops Sun AM, dry run + dial-in tests + agent setup Sun PM.
