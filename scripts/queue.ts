#!/usr/bin/env bun
/** Prints the routine queue: jobs awaiting a draft and replies Dan asked for. */
import { loadEnv, need, workerUrl } from "./env.ts";

loadEnv();
const res = await fetch(`${workerUrl()}/api/queue`, { headers: { authorization: `Bearer ${need("ROUTINE_TOKEN")}` } });
if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
const data = (await res.json()) as { runId: string; items: any[] };
console.log(`run ${data.runId} · ${data.items.length} items`);
for (const it of data.items) {
  if (it.kind === "application") {
    const j = it.job;
    console.log(`- [${j.source}] ${j.hot ? "🔥 " : ""}${j.title} · ${j.company ?? "?"} · ${j.score.total}/20 ${j.score.verdict} · ${j.url}`);
  } else {
    console.log(`- [reply] ${it.message.channel} · ${it.message.subject} · draft ${it.draftId}`);
  }
}
