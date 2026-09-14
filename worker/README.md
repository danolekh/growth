# growth worker

The always-on half of the hunt: one Cloudflare Worker (free plan) written in Effect 4, deployed
and wired by Alchemy, with Drizzle on D1 for state.

```
alchemy.run.ts        infra + runtime: D1, KV, Workers AI, secrets, cron, email route, handlers
src/Api.ts            HTTP: /telegram webhook, /api/* for the routine, /api/admin/* for scripts
src/Tick.ts           the */5 cron: one RSS keyword, enrich, score, card, fire, summaries
src/Ingest.ts         jobs pipeline (new → enriched → scored → drafted → applied)
src/Djinni.ts         RSS + public job-page parsing and the deterministic filters
src/HackerNews.ts     "Who is hiring?" via Algolia, one page per hour, remote + on-stack only
src/EffectJobs.ts     effect.website/effect-jobs directory, once a day, remote cards land hot
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
- Scoring thresholds: `SCORE_APPLY_MIN` (default 15) and `SCORE_LOW_MIN` (default 12, set to 11
  in .env) decide apply vs apply-low vs skip out of 20. Lower SCORE_LOW_MIN for more cards.
- `POST $WORKER_URL/api/admin/tick` with the admin token runs a tick on demand;
  `/api/admin/ingest?keyword=React` pulls one feed; `/api/admin/stats` prints counts.
- Bot commands: `/ping`, `/summary`, `/queue`, `/fire`, `/stage <applicationId> <stage>`,
  `/questions <draftId> <questions…>`.

## When drafting happens
Every scored job with an apply verdict goes into the routine's queue. The routine runs on its own
cron (`ROUTINE_CRON_HOURS_UTC`, default 05/08/11/14/17 UTC = 07:00, 10:00, 13:00, 16:00, 19:00
Vienna) and drafts everything queued. On top of that the Worker fires it on demand when a hot job
is waiting, a reply came in, questions were pasted, or you tap **Draft it**, at most
`MAX_FIRES_PER_DAY` times per Vienna day with `MIN_FIRE_GAP_MINUTES` between fires. Each card and
each "Queued for drafting" edit says which of the two will pick it up.

## Apply flow (one message per job, edited in place)
1. A card arrives: title, pay, flags, score, the buttons **Apply / Later / Skip** (or **Draft it**
   when the routine has not written the text yet).
2. **Apply** turns the same message into the package: the text in a copyable block, screening
   answers when there are any, form settings, and the buttons **✅ Applied**, **📎 Resume PDF**,
   **🔗 Open the post** (**💬 Open in Discord** for Discord posts, with the thread-reply fallback
   under the DM text), **⏭ Skip**, **❓ Questions**. Nothing is recorded yet.
3. Send it on the platform, then tap **✅ Applied**: the ledger row is written and the card collapses
   to one line with **↩️ Undo** (voids the row and brings the package back).
4. **Later** parks a card; the morning summary re-sends it. **Skip** closes it.

Screening questions: with `DJINNI_SESSION` set (Dan's `sessionid` cookie for djinni.co), the enrich
step reads the logged-in job page and the recruiter's questions go to the routine with the job, so
the answers are in the package from the start. Without it, or for other sites, tap **❓ Questions**
and paste them as a reply; the routine answers them on its next run and the package updates. When
the cookie expires the daily summary says so.

Discord reading: `POST /api/admin/ingest-discord` (admin token) takes
`{ posts: [{ id, channel, author, authorId?, content, url, createdAt }] }` from the Mac-side bot
described in `../hermes/discord-forwarder.md`; posts become hot `discord` jobs and get DM cards.

## Budget notes (free plan)
10 ms CPU and 50 subrequests per invocation, one cron trigger, 10k Workers AI neurons/day. The
tick does one RSS keyword, ≤3 page fetches, ≤3 scores and ≤4 cards per fire. If CPU time trips
(see `bunx alchemy logs`), lower those constants in `src/Tick.ts` before considering the paid plan.
