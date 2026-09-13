# Quick code fix - PayPal Smart Buttons on Trade Spray Ireland PWA

- **Job:** https://www.upwork.com/jobs/Quick-code-fix_~022078452044854523726/
- **Verdict:** pursue (score 14) - camp capture 2026-07-18 18:43
- **Budget & type:** $30 fixed
- **Connects:** unknown (tile-only capture, confirm on apply screen)
- **Strategy:** the diagnosis IS the proposal. Client spent $100K+ on Upwork; tiny job, fast 5.0 from a second client triggers JSS. Accept the $30.

## Cover letter

Hi!

I think I can see the bug from your post. You're loading the PayPal SDK with &components=hosted-buttons, and that parameter replaces the default buttons component. So paypal.Buttons never exists on the page and the render fails with exactly the kind of load error you're describing.

The fix: load the SDK with components=buttons (drop hosted-buttons entirely, you don't need it for dynamic pricing), render paypal.Buttons with a createOrder callback that passes your calculated cart total, and wire your real Client ID in from config instead of the placeholder. Then test the whole flow end to end: calculator, quote, cart, PayPal sandbox, then live.

Vanilla JS, PWAs, and service workers are daily territory for me, and I work with payment webhooks regularly (Stripe on my own projects). My last Upwork contract ended in a 5.0 review: https://www.danolekh.com/p/oasi-kadir

Happy to do this at your posted $30, same day. If I spot anything else off in the integration while I'm in there, you'll get a short written note about it.

Daniil

## Screening answers

- "Share examples of past PayPal integration work" - be honest: Stripe webhooks + payment flows on own projects, PayPal JS SDK is the same pattern. The correct root-cause diagnosis carries this.

## Apply settings

- Rate: $30 fixed as posted, single milestone
- Boost: no
