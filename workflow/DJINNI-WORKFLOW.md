# Hunt workflow (Claude and the routine read this)

Djinni is the proven channel: 11 tailored applications between 2026-08-06 and 2026-09-09 produced
one hire (job1) and one call. The failure mode was volume and freshness, not quality: about two
sends a week, often to posts that were days old with hundreds of applicants. This workflow turns
the watcher's inbox into three to five tailored sends a day.

## 1. Load the hunt
- The Worker does the ingest now (Djinni RSS every 20 min, Hacker News "Who is hiring" hourly,
  the Effect job directory daily, alert emails from Upwork, LinkedIn and Djinni). The queue of jobs worth drafting is `GET /api/queue` on the Worker (bearer token in
  `worker/.env`). `scripts/queue.ts` prints it; `/hunt-job` reads it.
- `detail.detail_error` on a job means the public page fetch failed; triage on RSS data and say
  the salary/years/applications are unknown.

## 2. Score every kept job (1-5 each)
- **Skills fit** against `me/skills.md`. TypeScript/React/Next/Node/Postgres = 5. Astro,
  TanStack, Effect, Drizzle named in the post = 5 and a `niche-stack` flag. A required stack Dan
  has never shipped (Angular, .NET, Python-first, mobile) = 1, skip.
- **Winnability**. Fresh (< 24h) and under ~80 applications = 4-5. `yearsRequired` at or under 3 =
  no filter risk; 4-5 = stretch, say so in the message; above 5 the watcher already skipped it.
  A post in Ukrainian from a Ukrainian company = write Ukrainian. "Last responded" is only visible
  logged in; Dan can read it on the page.
- **Stack-ability** (this replaces "Value"). Dan stacks jobs, so the question is hours and
  meetings, not just salary. Small team, "1-3 people per project", "sole engineer", async, product
  company, part-time allowed = 5. Outstaff into a client scrum team with dailies and a 9-6
  overlap = 2. Salary band: within $800-2,000 is the lane; above is welcome; under $800 = skip.
- **Signal quality**. Product company with a real site and a specific post = 5. Recycled
  template posts open for months, "$$$" with no band, agency talent pools = 2.

Verdict: **apply** (total ≥ 15, no 1s), **apply-low** (12-14, cheap to send, no hope invested),
**skip**. Skip freely. Three strong sends beat ten weak ones, and every send costs Dan's time.

## 3. Draft the application
For each apply / apply-low, create `applications/<slug>-djinni/` with:
- `job.md`: source, published date, views/applications at time of applying, company (one line on
  what they do, from their site if the post names it), salary band, work format, languages, the
  raw post, a requirements table (requirement → Dan's position: yes / partial / gap), verdict and
  angle. Same shape as `applications/dokport-healthtech-djinni/job.md`.
- `message.md`: the message in the language of the post (Ukrainian post → Ukrainian, with an
  English version below; English post → English), screening answers if the post lists questions,
  and **Form settings**: salary to enter, which resume variant to attach (`me/resume/`), and
  timing. Same shape as the existing `message.md` files.

Message rules (from `playbook/proposals.md`, they transfer one to one):
- First two lines carry the job-specific hook. No greeting padding, no "I saw your posting".
- Lead with the one proof that maps to their need: Quextro for solo ownership and AI features;
  the recent iGaming microservices work for Node/Express/Postgres/Redis/event-driven work;
  sportmagaz.com.ua (built and deployed solo, custom admin CMS for 2,000+ products, Nova Poshta,
  view transitions) for e-commerce, Next.js, admin panels and catalogs; consolline.com (built solo,
  Astro, 4 languages, WebGL2 animation, checked against Figma) for Astro, animation-heavy UI, i18n
  and Figma precision; Oasi Kadir numbers for performance and funnels; Azulejo for TanStack Start
  and Cloudflare. Case studies: danolekh.com/p/sportmagaz, /p/consolline, /p/oasi-kadir.
- Never say or imply that Dan has a job right now. No "day job", "current work", "my current
  role", "alongside", "in parallel", "capacity for another role", hours per week, or a company
  named as a present employer. Write about the iGaming platform as recent contract work in the
  past tense ("on a live iGaming platform I shipped …"), and name the company only if the post
  asks for references. Dan reads as available now (rule 7 in `playbook/proposals.md`).
  Before posting, search the message for these and rewrite every hit: "right now", "currently",
  "current", "at the moment", "on the side", "day job", "my week", "these days", "now I", "I ship",
  "I run", "I work on", "I build", "I own features", "already my normal", "hours a week". Present
  tense is fine only for skills and habits ("I use Claude Code daily", "TypeScript is my default"),
  never for an engagement ("I ship six microservices for a platform" is out; "on my last contract I
  shipped six microservices for a live iGaming platform" is in).
- Name honest gaps in one plain paragraph. It has been the most-praised part of past messages.
- Dan's voice: plain, warm, short sentences, hyphens not em-dashes, no "X not Y" flourishes, no
  labeled-list sentences. Read it back as speech.
- Location is Vienna, Austria now. Say "based in Vienna, EU time zone" when it helps (EU or
  Western clients); leave it out for Ukrainian-company posts unless they ask.
- Only claim what is in `me/skills.md` and `../me/experience.md`.

## 4. Salary to enter (locked 2026-09-13, see `playbook/income-plan-2026-09.md`)
- Profile number: **$1,500**.
- Per application: if the post shows a band, enter **60-70% of the band**, never the floor. No band
  visible: $1,500 for Ukrainian companies, $2,000 for EU/US product companies.
- Floor for a stacked, low-touch job: **$1,000**. Below that only if the hours are clearly ≤ 10/week.
- Never change the number mid-process.

## 5. Log it
The Worker logs sends when Dan taps Apply in Telegram (`applications` table in D1). Replies,
calls, tests and offers are recorded from inbound email or with the bot's `/stage` command.
`ledger/LEDGER-legacy.md` holds the history before 2026-09-13.

## 6. Daily loop (Dan, ~30 minutes)
1. Read the 08:30 Telegram summary.
2. Tap Apply / Skip / Later on the cards that arrived. Apply gives the text, the form settings,
   the resume PDF and the link; paste and send on the platform.
3. Reply to recruiters within the hour when awake; the bot drafts replies on request.
4. Sunday: read the weekly stats and change one thing.