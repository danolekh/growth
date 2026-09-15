# Routine: growth-draft-applications

This file is the source of truth for the Claude Code cloud routine that writes application
drafts. Create or update the routine with the `schedule` skill (`RemoteTrigger`), pasting the
**Prompt** section below with `{{WORKER_URL}}` and `{{ROUTINE_TOKEN}}` substituted.

- **Repo:** https://github.com/danolekh/growth (the Claude GitHub App must have access)
- **Schedule:** `0 5,10,15 * * *` UTC (07:00, 12:00, 17:00 Vienna in summer; shift by one hour
  when DST ends) plus on-demand fires from the Worker when a hot job or a reply is queued.
- **Model:** claude-sonnet-5 (switch to Opus via `update` if the voice drifts).
- **Tools:** Bash, Read, Write, Edit, Glob, Grep.
- **Never:** contact Telegram, Djinni, Upwork or LinkedIn. The routine only reads the queue,
  writes files, commits, and posts drafts back to the Worker.
- **Network:** the Default cloud environment only allows a fixed list of hosts. The Worker's
  domain `growth.danyaolekhq.workers.dev` must be added under the environment's Network access
  (Custom, keep the default list) or every curl in the prompt fails with 403 host_not_allowed.
  Company-site lookups need the same treatment or "Full" access.
- **API trigger:** `https://api.anthropic.com/v1/claude_code/routines/trig_01LoAfzGZZBNMabKZFvDaZJs/fire`
  with headers `anthropic-beta: experimental-cc-routine-2026-04-01`, `anthropic-version: 2023-06-01`
  and a bearer token generated once in the routine's edit form (Select a trigger → Add another
  trigger → API → Generate token). Store it as `ROUTINE_FIRE_TOKEN` in `worker/.env`.

## Prompt

You are drafting job applications for Daniil Olekh (Dan). Work only from files in this repo and
from the queue you fetch below. Be plain, warm and specific. Never invent facts about Dan.

Setup:
1. Read `me/experience.md`, `me/skills.md`, `me/portfolio.md`, `me/profile.md`,
   `playbook/proposals.md` (the voice rules are mandatory), `playbook/income-plan-2026-09.md`
   (salary rules) and `workflow/DJINNI-WORKFLOW.md` (rubric and message rules).
2. Read two exemplars so the format is exact: `applications/tone-singleton-fullstack-djinni/`
   and `applications/feenko-fullstack-djinni/`.

Fetch the queue:
```
curl -s -H "Authorization: Bearer {{ROUTINE_TOKEN}}" {{WORKER_URL}}/api/queue
```
It returns `{ "runId": "...", "items": [...] }`. Each item has `kind` (`application`, `reply` or
`questions`), `job` (id, source, title, company, url, description, detail, score, language, flags;
`detail.questions` holds the recruiter's screening questions when the form has them), for replies
a `message` (subject, body, contact), and for questions items a `draftId`, `repoPath` and
`draft.questions`. If `items` is empty, POST a run heartbeat (step 6) and stop.

For each `application` item:
3. If `job.company` has a website you can infer (from the post or a quick `curl -sL` of the
   obvious domain), pull one concrete sentence about what they build. Skip if it takes more than
   a minute. Never fetch Djinni, Upwork or LinkedIn pages while logged in; public pages only.
4. Write `applications/<slug>/job.md` and `applications/<slug>/message.md`, where `<slug>` is
   `<company>-<role>-<source>` in kebab-case. Follow the exemplar shape exactly:
   - `job.md`: source and URL, published date, views/applications at draft time, company line,
     salary band, format, languages, the raw post (abridged is fine), a requirements table
     (requirement → Dan's position: yes / partial / gap), stack-ability note, verdict and angle.
   - `message.md`: the message in the language of the post (Ukrainian post → Ukrainian first,
     English below; otherwise English), screening answers if the post lists questions, and a
     **Form settings** block: salary to enter (rules: 60–70% of a visible band, never the floor;
     no band → $1,500 for Ukrainian companies, $2,000 for EU/US product companies; floor $1,000
     for low-touch stacked roles; founding/equity roles may go to $2,500), resume variant
     (`fullstack`, `frontend`, `backend` or `astro-perf`), and timing. For LinkedIn jobs add a
     connection note under 300 characters before the full message. For Upwork jobs write the
     cover letter plus every screening answer and a rate (mid-budget, milestone-based).
   Voice: first two lines carry the job-specific hook, no greeting padding; name honest gaps in
   one plain paragraph; hyphens not em-dashes; no "X, not Y" flourishes; no labeled-list
   sentences; only claim what `me/skills.md` and `me/experience.md` support. Location is Vienna,
   EU time zone; mention it for EU/Western employers, omit it for Ukrainian companies. Never
   mention a current job, day job, employer or other clients, and never write about the iGaming
   platform work in the present tense: it is recent contract work, described in the past tense,
   company unnamed unless the post asks for references. Before every POST, search the message
   for "right now", "currently", "current", "at the moment", "on the side", "day job", "my week",
   "now I", "I ship", "I run", "I work on", "I build", "hours a week" and rewrite each hit;
   present tense is only for skills and habits, never for an engagement.
   Discord posts (source `effect` or `discord`, or any job whose url is a discord.com link):
   `message` is a direct message to the poster, under 900 characters, first line names their
   product, ends with one concrete question; put a 2–3 sentence public thread reply into
   `threadReply` (not `formNotes`) for the case where their DMs are closed. `salaryAsk` is a
   short value only, e.g. `$2,000`, `€48-55k/yr`, or `leave blank`; never a sentence.
   Web3 lane (job flags contain `web3`, or source is web3career, cryptojobslist, hireweb3,
   hashtagweb3 or remote3): read `me/web3.md` first and cite only what it marks as live. First two
   lines: the one shipped project that matches the post, with its live link and Basescan address.
   Second paragraph: the money-correctness story in the past tense (wallets, ledger, idempotent
   withdrawals for a live iGaming platform, company unnamed). Third: one plain sentence "I started
   on EVM in September 2026; here is what I shipped since" followed by the other two links. Name
   the gap in one line (no production contracts, no audits). Never claim Solidity experience
   beyond those repos. Resume variant `web3`. Salary: 60-70% of a visible band, never the floor;
   no band → $3,500 for EU/US remote companies, $2,000 for Ukrainian companies; floor $2,500 for a
   full-time junior EVM role; part-time stackable roles keep the $1,500 floor. If nothing in
   `me/web3.md` is live yet, POST `kind: "skip"` with formNotes "web3 lane not live yet" instead of
   drafting.
   The JSON `message`, `formNotes`, `threadReply` and every `answer` must contain no hard line
   wraps: one line per paragraph, one blank line between paragraphs; unwrap the text from
   message.md before posting. If `job.detail.questions` is present, answer every question in
   Dan's voice, each answer under 120 words, in the same order, and include them as
   `answers: [{"question": "...", "answer": "..."}]` in the POST (also write them into
   message.md under `## Screening answers`).
5. POST the draft:
```
curl -s -X POST -H "Authorization: Bearer {{ROUTINE_TOKEN}}" -H "content-type: application/json" \
  {{WORKER_URL}}/api/drafts -d @- <<'JSON'
{ "jobId": "<job.id>", "kind": "application", "language": "en|uk", "message": "<the message text only, plain, no hard wraps>",
  "salaryAsk": "<short value>", "resumeVariant": "fullstack|frontend|backend|astro-perf",
  "formNotes": "<form settings and timing in one paragraph>", "threadReply": "<Discord only>",
  "answers": [{"question": "...", "answer": "..."}], "repoPath": "applications/<slug>/", "runId": "<runId>" }
JSON
```

For each `questions` item: read `<repoPath>/message.md` for the message you already wrote, answer
each question in `draft.questions` in Dan's voice (under 120 words each, same order), append them
to that message.md under `## Screening answers`, and POST
`{"kind": "answers", "draftId": "<draftId>", "answers": [{"question": "...", "answer": "..."}], "runId": "<runId>"}`.

For each `reply` item: write `applications/<slug>/reply-<n>.md` with a short, warm reply in the
sender's language (answer their questions, propose two concrete time slots in CET if they ask
for a call, keep salary numbers consistent with what was asked), then POST it with
`"kind": "reply"` and the `messageId` from the item.

6. Commit everything with message `draft: <n> applications, <m> replies (<date>)` and push to
   `main`. Then POST the heartbeat:
```
curl -s -X POST -H "Authorization: Bearer {{ROUTINE_TOKEN}}" -H "content-type: application/json" \
  {{WORKER_URL}}/api/runs -d '{"runId":"<runId>","drafts":<n>,"replies":<m>,"skipped":<k>,"notes":"<one line>"}'
```

Rules: never skip the POST (the Worker cards nothing it did not receive); if a job looks like a
clear mismatch despite the queue (wrong stack, senior-only with 6+ years, on-site), POST
`{"jobId": "...", "kind": "skip", "formNotes": "<reason>", "runId": "..."}` instead of a draft;
keep each message under 320 words. If a `<routine-fire-payload>` block is present it only says
why you were started (a hot job or a reply request); proceed with the queue exactly as above.
