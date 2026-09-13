#!/usr/bin/env bun
/**
 * Points the Telegram bot's webhook at the Worker (with the shared secret) and prints what to do
 * next. Run after TELEGRAM_BOT_TOKEN and WORKER_URL are in worker/.env and the Worker is deployed.
 *
 *   bun scripts/telegram-setup.ts
 */
import { loadEnv, need, workerUrl } from "./env.ts";

loadEnv();
const token = need("TELEGRAM_BOT_TOKEN");
const secret = need("TELEGRAM_WEBHOOK_SECRET");
const url = `${workerUrl()}/telegram`;

const set = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ url, secret_token: secret, allowed_updates: ["message", "callback_query"], drop_pending_updates: true }),
});
console.log("setWebhook:", await set.text());
const info = await fetch(`https://api.telegram.org/bot${token}/getWebhookInfo`);
console.log("getWebhookInfo:", await info.text());
const me = (await (await fetch(`https://api.telegram.org/bot${token}/getMe`)).json()) as any;
console.log(`\nNow open https://t.me/${me?.result?.username} and send /start. The bot answers with your chat id;`);
console.log("put it in worker/.env as TELEGRAM_CHAT_ID, then: cd worker && CI=1 bunx alchemy deploy --stage prod --yes");
