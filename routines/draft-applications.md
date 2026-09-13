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
It returns `{ "runId": "...", "items": [...] }`. Each item has `kind` (`application` or `reply`),
`job` (id, source, title, company, url, description, detail, score, language, flags) and for
replies a `message` (subject, body, contact). If `items` is empty, POST a run heartbeat (step 6)
and stop.

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
   EU time zone; mention it for EU/Western employers, omit it for Ukrainian companies.
5. POST the draft:
```
curl -s -X POST -H "Authorization: Bearer {{ROUTINE_TOKEN}}" -H "content-type: application/json" \
  {{WORKER_URL}}/api/drafts -d @- <<'JSON'
{ "jobId": "<job.id>", "kind": "application", "language": "en|uk", "message": "<the message text only, plain>",
  "salaryAsk": "<what to enter>", "resumeVariant": "fullstack|frontend|backend|astro-perf",
  "formNotes": "<form settings and timing in one paragraph>", "repoPath": "applications/<slug>/", "runId": "<runId>" }
JSON
```

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
keep each message under 320 words.
