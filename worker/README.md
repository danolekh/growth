# growth worker

The always-on half of the hunt: one Cloudflare Worker (free plan) written in Effect 4, deployed
and wired by Alchemy, with Drizzle on D1 for state.

```
alchemy.run.ts        infra + runtime: D1, KV, Workers AI, secrets, cron, email route, handlers
src/Api.ts            HTTP: /telegram webhook, /api/* for the routine, /api/admin/* for scripts
src/Tick.ts           the */5 cron: one RSS keyword, enrich, score, card, fire, summaries
src/Ingest.ts         jobs pipeline (new → enriched → scored → drafted → applied)
src/Djinni.ts         RSS + public job-page parsing and the deterministic filters
src/Email*.ts         jobs@danolekh.com: classify alerts and messages, extract job links
src/Score.ts          Workers AI scoring (JSON schema), OpenRouter fallback
src/Telegram.ts       bot client (from the sportmagaz worker) + cards in src/Cards.ts
src/Summary.ts        daily 08:30 and weekly Sunday 19:00 texts, housekeeping
src/Db.ts             repository over Drizzle; schema in src/db/schema.ts; SQL in migrations/
```

## First deploy
1. `bun install` (versions are pinned and overridden on purpose: alchemy 2.0.0-beta.70 needs
   effect 4.0.0-beta.102 and drizzle 1.0.0-rc.4; do not float them).
2. `cp .env.example .env` and fill it. Generate `ROUTINE_TOKEN`, `ADMIN_TOKEN`,
   `TELEGRAM_WEBHOOK_SECRET` with `openssl rand -hex 24`.
3. Cloudflare auth: `bunx alchemy login` (browser) or `CLOUDFLARE_API_TOKEN` in `.env`.
4. `bunx alchemy deploy --stage prod --dry-run`, read the plan, then
   `bunx alchemy deploy --stage prod --yes`. Note the workers.dev URL it prints; put it in
   `WORKER_URL` in `.env`.
5. Telegram: `curl "https://api.telegram.org/bot$TOKEN/setWebhook" -d url=$WORKER_URL/telegram
   -d secret_token=$TELEGRAM_WEBHOOK_SECRET -d 'allowed_updates=["message","callback_query"]'`.
   Send `/start` to the bot, copy the chat id into `TELEGRAM_CHAT_ID`, redeploy.
6. Email: the deploy enables Email Routing on danolekh.com and routes `jobs@` to the Worker.
   If Cloudflare reports the zone as `unconfigured`, add the MX/SPF records it lists in the
   dashboard (Email → Email Routing). In Gmail, filters for `from:upwork.com`,
   `from:linkedin.com`, `from:djinni.co` → forward to `jobs@danolekh.com`. The forwarding
   confirmation shows up in Telegram as an unknown-mail preview.
7. Routine: `growth-draft-applications` exists (id `trig_01LoAfzGZZBNMabKZFvDaZJs`,
   https://claude.ai/code/routines/trig_01LoAfzGZZBNMabKZFvDaZJs), cron `0 5,10,15 * * *` UTC, plus an
   API trigger whose URL and token live in `.env` as `ROUTINE_FIRE_URL` / `ROUTINE_FIRE_TOKEN` (a
   deploy binds them to the Worker; `/fire` in the bot then works). The routine's cloud environment
   must allow `growth.danyaolekhq.workers.dev` in its network access. Regenerate the prompt after edits with
   `bun scripts/routine-prompt.ts` and update the routine via the `schedule` skill.
8. `cd ../me/resume && bun run build && cd ../.. && bun scripts/upload-resumes.ts`.
9. `bun scripts/seed-legacy.ts` → three cards appear.

## Day to day
- `bun test` for the parsers. `bun run typecheck`.
- Schema change: edit `src/db/schema.ts`, `bunx drizzle-kit generate`,
  `bun scripts/sync-migrations.ts`, deploy.
- `POST $WORKER_URL/api/admin/tick` with the admin token runs a tick on demand;
  `/api/admin/ingest?keyword=React` pulls one feed; `/api/admin/stats` prints counts.
- Bot commands: `/ping`, `/summary`, `/queue`, `/fire`, `/stage <applicationId> <stage>`.

## Budget notes (free plan)
10 ms CPU and 50 subrequests per invocation, one cron trigger, 10k Workers AI neurons/day. The
tick does one RSS keyword, ≤3 page fetches, ≤3 scores and ≤4 cards per fire. If CPU time trips
(see `bunx alchemy logs`), lower those constants in `src/Tick.ts` before considering the paid plan.
