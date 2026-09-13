# growth

Automated job hunt for Daniil Olekh. Identity in `me/`, doctrine in `playbook/`, drafts in
`applications/`, the always-on Worker in `worker/`, the drafting routine in `routines/`.

- Worker: Cloudflare (free plan), Effect 4, Alchemy, Drizzle on D1. `cd worker && bun install`.
- Sources: Djinni RSS + public job pages; Upwork, LinkedIn and Djinni alert emails via
  `jobs@danolekh.com`.
- Control surface: a Telegram bot (cards with Apply / Skip / Later, daily summary 08:30 Vienna).
- Drafting: Claude Code cloud routine on a schedule and on demand.

Setup and runbook: `worker/README.md`.
