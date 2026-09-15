#!/usr/bin/env bun
/**
 * Uploads each resume PDF to the Telegram chat once and registers the returned file_id with the
 * Worker, so Apply can attach the PDF without the Worker ever holding the bytes.
 *
 *   cd me/resume && bun run build && cd ../.. && bun scripts/upload-resumes.ts
 */
import { existsSync } from "node:fs";
import { join } from "node:path";

import { loadEnv, need, workerUrl } from "./env.ts";

loadEnv();
const token = need("TELEGRAM_BOT_TOKEN");
const chatId = need("TELEGRAM_CHAT_ID");
const variants = ["fullstack", "frontend", "backend", "astro-perf", "web3"];

for (const v of variants) {
  const path = join(import.meta.dir, "..", "me", "resume", "out", `Resume-${v}.pdf`);
  if (!existsSync(path)) {
    console.warn(`missing ${path}, run bun run build in me/resume`);
    continue;
  }
  const form = new FormData();
  form.set("chat_id", chatId);
  form.set("caption", `Resume · ${v} (registry)`);
  form.set("disable_notification", "true");
  form.set("document", new Blob([await Bun.file(path).arrayBuffer()], { type: "application/pdf" }), `Daniil-Olekh-${v}.pdf`);
  const tg = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, { method: "POST", body: form });
  const json = (await tg.json()) as any;
  const fileId = json?.result?.document?.file_id;
  if (!fileId) {
    console.error(`upload failed for ${v}:`, JSON.stringify(json).slice(0, 300));
    continue;
  }
  const reg = await fetch(`${workerUrl()}/api/admin/resume-files`, {
    method: "POST",
    headers: { authorization: `Bearer ${need("ADMIN_TOKEN")}`, "content-type": "application/json" },
    body: JSON.stringify({ variant: v, fileId }),
  });
  console.log(`${v}: ${reg.status} ${fileId.slice(0, 12)}…`);
}
