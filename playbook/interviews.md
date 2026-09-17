# Interviews — how Dan introduces himself

Written 2026-09-17, before the Procimo Tech screening call. Use it for every call a Djinni, LinkedIn
or HN application turns into. Claims come from `me/experience.md` and `me/skills.md` only; the voice
rules in `proposals.md` apply to what Dan says out loud too.

## Rules
- **Never mention current work.** Every engagement is past tense: "most recently I was on a
  contract", "on that contract I built". No "currently", "at the moment", "my current role", "on
  the side", "alongside", "hours a week" (same list as `workflow/DJINNI-WORKFLOW.md`).
- Resume and LinkedIn dates for the 2026 contract read **"2026"**, never "present". Say the same.
- Don't name the iGaming client. Name the live sites: **consolline.com**, **sportmagaz.com.ua**,
  plus Quextro and the Oasi Kadir case study.
- consolline.com: Dan built the Astro site on his own. Don't claim its deploy pipeline.
- **Availability:** state when you can start, and stop there.
- **Salary:** repeat the number from the application form. Never change it mid-process and never
  go below it (`income-plan-2026-09.md`). If asked gross or net: it's the amount invoiced as a
  contractor through the Ukrainian FOP.

## The 60-second intro
Practise it out loud until it sounds like talking, not reading.

I'm Dan, a full-stack TypeScript developer based in Vienna, about three years of commercial work.
Most recently I was on a contract building Node microservices for a live iGaming platform - wallet,
bonus, identity - on Express, Postgres and Redis. On that contract I also built consolline.com on my
own, a four-language Astro site for a logistics company with WebGL animation, matched to the Figma
design. Before that I built Quextro, an ed-tech platform, solo from an empty repo to real users. As a
freelancer I built and deployed sportmagaz.com.ua alone, a sports-equipment shop with its own admin
panel. I like owning a feature from the database to the UI.

Trim to fit the role: for a backend post, lead with the iGaming services and drop consolline; for
a frontend or Astro post, lead with consolline and sportmagaz.

## Four stories (about 90 seconds each)
Shape: the problem, what I did, the result, what I'd do again.

1. **iGaming platform - money had to be exactly right.** Idempotent withdrawals keyed on the ledger
   index, single-statement bonus expiry with debit, abuse limits on bonus issuance. Or the per-brand
   GEO access rules end to end: schema, the shared decision function, gateway counters in Redis,
   alerts on threshold crossings, admin CRUD and the React admin UI. Good for: "a hard problem",
   "a feature you owned", reliability, security.
2. **consolline.com - a demanding design, four languages, built alone.** WebGL2 shaders with no
   animation library: a globe that spins with scroll and drag and pauses off-screen, a halftone dot
   field that reacts to the pointer. Headlines sized at build time with fontkit so no language shifts
   the layout (1238.72px against 1239 in Figma). A language switch keeps your scroll, tabs and form
   values. Checked against Figma with pixel diffs, 0 clipped elements across 14 routes at three phone
   widths, every line of the client's copy brief audited on the page. Good for: frontend depth,
   attention to detail, "how do you make sure it matches the design".
3. **Quextro - empty repo to real users, solo.** Bun, Effect.ts, Drizzle, React 19 and TanStack
   Router; the LLM pipeline that pulls questions and topics out of PDF exam papers, with Zod-checked
   output and retries; CI/CD, Docker and OpenTelemetry. Used by British teachers and students. Good
   for: ownership, AI features, prototype to production.
4. **sportmagaz.com.ua - a real store, built and deployed alone.** Next.js 14, tRPC, Drizzle and
   Postgres, with its own admin CMS for 2,000+ products (roles, specs editor, S3 image manager).
   Filters on a generic attribute model with live "+N" counts next to each option. Nova Poshta lookup
   at checkout, Telegram order alerts. In 2026 I moved it to static Astro on Cloudflare, with view
   transitions where the product photo morphs into its page and prices re-checked on the server.
   Good for: e-commerce, admin panels, data modelling, "tell me about a migration".

Also have one real example ready of catching a wrong AI output in review (Claude Code daily, every
diff read). It has to be Dan's own case.

## Gaps
Name the gap in one sentence, give the nearest real experience, say what you'd need to learn. Never
stretch a skill that isn't in `me/skills.md`.

- "I haven't used Elasticsearch in production. I've built search and filtering on Postgres, like
  the attribute filters with live counts on sportmagaz. I'd need to learn the indexing and relevance
  side."
- "I haven't shipped React Native. I've used React for three years, so the part I'd learn is the
  mobile side, like native builds and app store releases."

## Questions to ask (pick 3-4)
- What does the product look like today, and what would I work on first?
- How big is the engineering team, and who would I work with day to day?
- What does the stack look like beyond the post (databases, hosting, testing)?
- How does work get planned and reviewed? How do you use AI tools?
- What does the contract look like for someone in Austria, and what are the core hours?
- What are the next steps?

## Before and after the call
- Check the time zone on the invite (Vienna).
- Open: the job post, the message you sent, the resume variant you attached, danolekh.com.
- Test camera and mic, quiet room.
- Log the stage in Telegram: `/stage <applicationId> call` (then `test`, `offer`, …).
- Same day: a two-line thank-you on the platform.
