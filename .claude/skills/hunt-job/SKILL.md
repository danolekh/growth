---
name: hunt-job
description: Triage a job posting (Djinni, LinkedIn, Upwork, anywhere) and draft the tailored application by hand, or work the Worker queue when the routine is down. Use when Dan pastes a job or link, says "draft this", "process the queue", or asks "should I apply to this?". Produces applications/<slug>/job.md + message.md and POSTs the draft to the Worker so a Telegram card appears.
user-invocable: true
---

# hunt-job — from posting to a ready-to-send application

## Read first
- `workflow/DJINNI-WORKFLOW.md` — the rubric (skills fit, winnability, stack-ability, signal quality),
  verdicts, message rules, salary rules, the ledger.
- `playbook/income-plan-2026-09.md` — the goal, the ask numbers, what "low-touch" means.
- `me/experience.md`, `me/skills.md`, `me/portfolio.md` — the only sources of claims.
- `playbook/proposals.md` — Dan's voice rules (they apply to Djinni messages too).
- Two model applications: `applications/dokport-healthtech-djinni/` (English, gaps named) and
  `applications/feenko-fullstack-djinni/` (Ukrainian, stack one to one, proof-led).

## Queue mode ("process the queue")
1. Run `bun scripts/queue.ts` (reads `worker/.env` for the URL and token) to print the queue.
2. Score every job per the workflow. Print one ranked table: title, company, band, years, apps,
   age, verdict, one-line reason. Be ruthless with skips.
3. For every **apply** and **apply-low**, scaffold `applications/<slug>/job.md` and
   `message.md` (slug = company-role-source), then `bun scripts/post-draft.ts applications/<slug>`
   so the Worker cards it. If a company site is named and the post is worth it, fetch the site for one
   concrete line about what they build.
4. Close with: the top picks in send order, the salary to enter for each, and the resume variant.

## Single mode (one pasted job)
Same rubric, same outputs, for the one post. If Dan pasted a link only, fetch the public page.
LinkedIn: add a connection note under 300 characters. Upwork: cover letter + screening answers + rate.

## Rules
- Language follows the post. Ukrainian post → Ukrainian message first, English below.
- Location is Vienna, Austria. Mention EU time zone for EU/Western clients; skip it for Ukrainian companies.
- Never invent applicant counts, salary bands, or company facts. "Unknown" is a fine answer.
- Message as plain text bracketed by `---`, never in a blockquote or code fence.
- Salary: 60-70% of the visible band, never the floor; $1,500 default, $1,000 floor for low-touch.
