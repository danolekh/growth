# growth — Dan's automated job hunt

This repo is the identity source and the control plane for Daniil Olekh's job hunt. Two
readers: Claude Code sessions on Dan's Mac (you, now) and the cloud routine
`growth-draft-applications` (`routines/draft-applications.md`), which clones this repo on a
schedule. Anything a routine needs must be committed here; routines cannot see Dan's machine.

## The system in one paragraph
A Cloudflare Worker (`worker/`, Effect 4 + Alchemy + Drizzle on D1) pulls Djinni RSS every 20
minutes, the Hacker News hiring thread hourly and the Effect job directory daily, receives
Upwork, LinkedIn and Djinni alert emails at `jobs@danolekh.com`, filters and scores jobs, and asks the cloud routine to draft tailored applications. Dan gets each draft as a
Telegram card with Apply / Skip / Later; Apply hands him the ready text, form settings, resume
PDF and link. Nothing is ever auto-submitted on Upwork or LinkedIn. A daily summary lands at
08:30 Vienna. The plan and the numbers live in `playbook/income-plan-2026-09.md`.

## Who Dan is (read these first)
- `me/profile.md`, `me/experience.md`, `me/skills.md`, `me/portfolio.md` — the only sources
  of claims. Never promise outside `me/skills.md`.
- `me/resume/` — resume generator (`bun run build` on the Mac; Chrome required). Variants:
  fullstack, frontend, backend, astro-perf. PDFs in `me/resume/out/` are committed and uploaded
  to Telegram once via `scripts/upload-resumes.ts`.
- `me/djinni-profile.md`, `me/linkedin-profile.md` — paste-ready profile texts (Vienna, 3 yrs).
- `playbook/proposals.md` — Dan's voice rules. Mandatory for every message.
- `playbook/income-plan-2026-09.md` — goal, channels, salary asks, stacking rules.
- `case-studies/oasi-kadir.md` — the anchor proof (69→99 mobile PageSpeed, 5.0 review).

## Working here
- **Effect first.** Worker code is Effect 4 (`effect@4.0.0-beta.102`, pinned with Alchemy
  `2.0.0-beta.70`; see `worker/package.json` overrides). Infra is `worker/alchemy.run.ts`.
  Data is Drizzle (`worker/src/db/schema.ts`, migrations in `worker/drizzle/`). Do not add a
  plain wrangler config; Alchemy owns the Worker.
- **Deploy** per `~/.claude/skills/cloudflare-deploy/SKILL.md`: `cd worker && bunx alchemy
  deploy --stage prod --dry-run` first, then `--yes`. Never `unsafe nuke`, never `--adopt`
  unattended, never touch the live sites (danolekh.com, azulejo, agriturismo, preview-*).
- **Secrets** live in `worker/.env` (gitignored) and become Worker secrets on deploy. Never
  commit tokens. The routine token is the only secret that leaves the Worker, embedded in the
  routine prompt.
- **Applications** are written by the routine into `applications/<slug>/` (job.md +
  message.md). When you draft one by hand (skill `/hunt-job`), use the same shape and POST it
  to the Worker so it gets a card.
- **Ledger** is D1 (`applications` table); `ledger/LEDGER-legacy.md` is the frozen history.
- Skills: `/hunt-job` (triage + draft one pasted job or the current queue), `/write-proposal`,
  `/triage-job` (Upwork rubric).

## Guardrails
- Never auto-submit on Upwork or LinkedIn; Djinni auto-submit is a phase-2 decision for Dan.
- Only claim skills in `me/skills.md`. Name gaps plainly.
- Location is Vienna, Austria (since Sept 2026). Ukrainian FOP for invoicing.
- Retired demos (qrorder, DocQA, Marque, AutoShip) are never cited.
