#!/usr/bin/env bun
/**
 * Posts a hand-written application folder to the Worker so it gets a Telegram card.
 *
 *   bun scripts/post-draft.ts applications/<slug> --job djinni:848006 [--variant fullstack] [--ask "$2,000"] [--lang en]
 *
 * The message is the text between "## Message" (or "## Ukrainian") and the next "##" heading in
 * message.md; the form settings block, if present, becomes formNotes.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { loadEnv, need, workerUrl } from "./env.ts";

loadEnv();
const [dir, ...rest] = process.argv.slice(2);
if (!dir) throw new Error("usage: post-draft.ts <application dir> --job <source:id>");
const flag = (n: string) => {
  const i = rest.indexOf(n);
  return i > -1 ? rest[i + 1] : undefined;
};
const jobId = flag("--job");
if (!jobId) throw new Error("--job <source:id> is required");

const md = readFileSync(join(dir, "message.md"), "utf8");
const section = (title: RegExp) => {
  const m = md.match(new RegExp(`^## ${title.source}[^\n]*\n([\\s\\S]*?)(?=^## |\\Z)`, "m"));
  return m ? m[1]!.trim() : "";
};
const message = section(/(Message|Ukrainian|English)/) || md;
const form = section(/Form settings/);

const body = {
  jobId,
  kind: "application",
  language: flag("--lang") ?? (/[Ѐ-ӿ]/.test(message) ? "uk" : "en"),
  message,
  salaryAsk: flag("--ask") ?? (form.match(/\$\s?[\d,]+/) || [])[0] ?? null,
  resumeVariant: flag("--variant") ?? (form.match(/Resume-(\w[\w-]*)\.pdf/) || [])[1] ?? "fullstack",
  formNotes: form.replace(/\n+/g, " ").slice(0, 900) || null,
  repoPath: dir.replace(/\/+$/, "") + "/",
  runId: null,
};
const res = await fetch(`${workerUrl()}/api/drafts`, {
  method: "POST",
  headers: { authorization: `Bearer ${need("ROUTINE_TOKEN")}`, "content-type": "application/json" },
  body: JSON.stringify(body),
});
console.log(res.status, await res.text());
