# Reply to Justin — call invite (2026-08-19)

**Status update:** the posting looked half-abandoned (published Apr 2025, 103 applicants, recruiter
silent for a month) and the triage called it low priority. It got a reply anyway, 9 days after
sending. Justin asked for a quick call on Friday and offered to forward Dan's details to their
internal recruiter. Friday = **21 August 2026**.

## Reply (send this)

Hi Justin,

Thanks for getting back to me, and yes, Friday works.

I'm free 10:00 to 13:00 and 14:00 to 17:00 CET, so pick whatever slot suits you and I'll make it
work. I'm in Kyiv, which is one hour ahead of CET, and overlapping with CET business hours is no
problem on my side.

Happy to walk through any of the work I mentioned on the call, and if it's useful I can share more
detail on the payment and infra parts before we talk.

Looking forward to it.

Best,
Daniil

## Prep for the call

Things they will almost certainly probe, since the application named them:

- **Nginx and DigitalOcean.** He said openly he hasn't owned production Nginx configs or VPS deploys.
  Don't retreat from that, but have the bridge ready: Docker and Linux are comfortable, Cloudflare
  Workers and Railway deploys are his, and reverse proxy config is a weekend of reading plus a
  staging box. Offer to set one up before a test task if they want proof.
- **Payments.** Stripe Checkout and webhooks only. No PayPal, Apple Pay, Google Pay or 3DS. The
  honest framing is that the hard part of payment work is the async state machine, redirects that
  come back wrong, webhooks arriving out of order or twice, and that part he has done.
- **"Prefers Vanilla JS over heavy frameworks."** This is the cultural question. The Oasi Kadir
  reverse-engineering story is the answer: reading a minified production bundle and reimplementing
  its behaviour in plain JS is not framework work.
- **3+ years.** His Djinni profile says 2. Radency plus freelance plus Quextro is defensibly ~2.5.
  State the real number, don't inflate it, and let the work carry it.
- **Salary.** The application asked $1,300 against a band up to $1,700. Hold $1,300 if they ask
  directly, since changing the number mid-process reads badly. If they open the conversation about
  scope being bigger than advertised, that's the moment to talk range, not before.
- **Employment type.** The post says "Full-time, Freelance", so ask what that means concretely:
  contract, invoicing, hours expected, and whether the trial is paid.

Worth asking them: what does the current codebase look like, who else is on the team, and what is
the first thing they would want fixed.
