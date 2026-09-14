# Proposal Playbook

How to write proposals that win. Everything here is distilled from the **Oasi Kadir win**
(see `../case-studies/oasi-kadir.md`) — these are proven, not theoretical.

## The 10 things that actually won the job

1. **Lead with a live demo.** Before even applying, Dan built a working sample landing page on
   the client's exact stack (Astro + Tailwind + Vercel) and put the link at the top of the
   proposal. This was the single biggest differentiator. See `live-demo-play.md`.
2. **Mirror the client's stated priorities.** Ashraf stressed *maintainable, commented code* →
   Dan's proposal led with a real, well-commented `RoomCard.astro` component. Read what the
   client repeats and obsesses over, then prove that exact thing.
3. **Address every hard requirement explicitly.** The post listed Strapi prod, Railway, i18n,
   Cloudinary/S3, roles, Vercel — answer each, concisely, point by point. No requirement left
   unaddressed = no doubt left in the client's mind.
4. **Warm, confident, concise tone.** "Glad you liked the demo. I really love that you have a
   well-defined scope." Not salesy, not groveling. Peer-to-peer.
5. **Structured milestones win trust.** A clear breakdown (deliverable + % + price + week) made
   Ashraf say *"exactly the kind of structured approach I was looking for."* See the template below.
6. **Price mid-range of the stated budget.** Budget was €1,000–1,500; Dan quoted **$1,300**.
   Not the cheapest (signals low quality), not over the top.
7. **State availability + that you can start now.** "I am fully available right now. I can start today."
8. **Be flexible.** When the client asked for a 1-week bug-fix buffer, Dan agreed instantly.
9. **Be transparent.** Shared the demo's GitHub repo the moment it was requested.
10. **Respect Upwork rules.** Resume attached with contacts stripped; all comms on-platform.

## Reusable proposal skeleton

```
1. HOOK — the strongest proof, first line.
   → PREVIEW RULE (see snipe-play.md): the client sees only ~2 lines + your rate + JSS in their
     proposal list BEFORE opening. Those 2 lines decide the view. So: no greeting, no "I read
     your post", no self-intro — the first sentence carries the job-specific observation or
     proof. Best of all: something about THEIR site/product ("Your product pages score 54 on
     mobile PageSpeed — the two biggest causes are X and Y; I fixed exactly this last month,
     69→99, review on my profile").
   → Live demo link (best), or a shipped product / repo that matches their need.
   → "I saw your posting and immediately built out a live sample ... You can check it here: <url>"
   → NEW default for speed/rescue/small jobs (profile-building phase): the review numbers.
     "On my last Upwork contract I took a slow site from a 69 mobile PageSpeed score to 99, and
     from 16 seconds to under 2. Here's the client's review and the full write-up:
     https://www.danolekh.com/p/oasi-kadir". A verified 5.0 review with numbers in it now beats
     building a fresh demo for these jobs.

1b. DE-RISK (only if your account is unproven — few reviews / no JSS) — one line, right after the hook.
   → "I'm newer on Upwork, so I make this low-risk: start with a small paid test slice, milestone
     approvals, you only pay on approval." Neutralize the bet-on-an-unknown fear early, not in a footer.

2. CREDIBILITY — 1–2 sentences, tailored to THIS job.
   → The one role/project from me/experience.md that maps to their need + a concrete number.

3. PROOF SAMPLE — only if it matches a priority they stated.
   → e.g. a commented component if they care about code quality; a perf score if they care about speed.

4. EXECUTION PLAN — their scope, answered point by point, concisely.
   → Show you read the whole post. Name their tools (Railway, i18n, Cloudinary...) back to them.

5. PRICE + TIMELINE + MILESTONES — concrete, mid-budget, milestone-based.

6. AVAILABILITY + CLOSE — "available now, can start today" + warm sign-off.
```

Keep it scannable. Short paragraphs, white space. Clients skim.

## Write in Dan's voice (style rules — follow these every time)
Dan writes simply and plainly. Match how he actually talks, not polished "copywriter" prose.

- **No antithesis / contrast flourishes.** Don't write "X, not Y" constructions. Drop the second
  half. e.g. "I'll let you know before I start on it" (NOT "...before I touch it, not after").
- **No clever quips.** Skip lines like "not something I'd learn on your dime" or "you only pay if it
  works". Just state the point plainly ("so I'm very comfortable with the ORM").
- **Never use em-dashes (`—`).** Use a hyphen (`-`) instead, everywhere.
- **No labeled-list sentences.** Don't lead a sentence with a topic label + dash, like
  "Turnaround — ..." or "React/TS/Node experience — ...". Instead weave the answer into natural
  prose that references what you're answering: "Regarding turnaround, ..." / "You mentioned pricing,
  and I really like that model, in fact ...".
- Keep sentences simple and conversational. Short, warm, direct. Read it back and ask "would Dan
  actually say this out loud?" If it sounds like marketing copy, rewrite it plainer.

## Formatting rule — proposal text in the terminal
When outputting a proposal/cover-letter for Dan to copy-paste, print it as **plain text**, NOT inside
a markdown blockquote (`>`) or code fence. The left "wall" of a blockquote gets copied along with the
text and has to be cleaned up by hand. Separate the proposal from the surrounding chatter with a
horizontal rule (`---`) above and below instead, and write the body as ordinary paragraphs.

## Neutralize the client's #1 fear early (unproven-account opener)
While Dan's account is young (1 completed job, one 5.0 review, no JSS yet), a risk-averse or
first-time-hiring client's real hesitation isn't *"can he build it"* — the demo answers that — it's
*"do I want to bet money on someone with a thin track record?"* See `the-trust-gap.md`. The review
softens this a lot — cite it — but keep the de-risk line until JSS + a few more reviews land.

So **move the de-risk offer into the first third of the proposal, not the footer.** Right after the
demo hook, in one line, offer:
- a **small paid test slice** ("start with the menu → cart slice"),
- **milestone approvals — you only pay on approval**,
- "start small, scale if it goes well."

**Anti-example:** the QR-ordering proposal (`../applications/_archive/qr-ordering-saas/proposal.md`) buried
*"Happy to start with a small paid test task first"* as the **last line**, after the price. For an
unproven account that de-risk line is one of the strongest things in the proposal — it belongs near the
top, where a nervous client is still deciding whether to keep reading. (Established accounts with a wall
of reviews don't need this — the reviews already de-risk; skip the opener and lead with proof.)

## Milestone-breakdown template (the format Ashraf loved)

For each milestone: **name (~week N) — $amount (XX%)**, then 1–2 sentences on *why it matters*
and a one-line **Deliverable:**.

**Match the structure to the job size.** For the small fixed jobs this phase targets ($200–800,
<2 weeks): a **flat price** or **two milestones (50/50)** — e.g. "audit + plan" then "fixes live +
verified numbers". Four milestones on a $300 job reads as bureaucracy. The 20/20/40/20 split across
4 milestones is for multi-week builds ($1k+), where it worked well:

```
Milestone 1: <Foundation> (~week 1) — $X (20%)
<Why this is the foundation.> Deliverable: <concrete, verifiable output>.

Milestone 2: <Core build> (~week 2) — $X (20%)
...

Milestone 3: <Main deliverables> (~week 3) — $X (40%)
...

Milestone 4: <Polish, deploy, handover> (~week 3–4) — $X (20%)
...
```

Offer a short **bug-fix / buffer window** after the last milestone — clients value it and it
costs little to promise.

## Filled example — the opener that worked (adapt, don't copy verbatim)

> Hi there!
>
> I saw your posting and immediately built out a live sample landing page based on your
> description. You can check out the working demo here: https://agriturismo.danolekh.com/
> (built with Astro, Tailwind & deployed on Vercel)
>
> I appreciate a strictly defined scope. You have the wireframes, content models, and design
> assets ready; I have the Astro, Tailwind, and headless-CMS expertise to execute this cleanly
> and maintainably.
>
> [Strapi/Railway/i18n/roles answered point by point]
>
> Code maintainability is a top priority. Here's how I structure and document my components:
> [short, real, commented component]

## Anti-patterns (don't)
- Generic openers ("I am a hard-working developer with X years..."). Delete on sight.
- Walls of text. Restating the job back without adding anything.
- Underpricing to win — it signals low quality and attracts bad clients.
- Promising stacks/skills not in `me/skills.md`.
- Mentioning a current job, day job, employer or other clients (added 2026-09-14: Dan reads it as
  a red flag). Past work is described in the past tense; availability is stated, not explained.
- Ignoring an explicit requirement in the post (the client will notice).
