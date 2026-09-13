#!/usr/bin/env bun
/**
 * One-off migration of the pre-Worker state: the three queued Djinni drafts become cards, the
 * ids the old watcher already saw become skipped rows (so they are not re-carded), and the
 * eleven ledger rows land in `applications`.
 *
 *   bun scripts/seed-legacy.ts
 */
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { loadEnv, need, workerUrl } from "./env.ts";

loadEnv();
const root = join(import.meta.dir, "..");
const nowIso = new Date().toISOString();

const readSection = (md: string, title: RegExp) => {
  const m = md.match(new RegExp(`^## ${title.source}[^\n]*\n([\\s\\S]*?)(?=^## |\\Z)`, "m"));
  return m ? m[1]!.trim() : "";
};

const queued = [
  { dir: "tone-singleton-fullstack-djinni", id: "djinni:848006", url: "https://djinni.co/jobs/848006-full-stack-engineer-data-cloud-aws-software/", title: "Full Stack Engineer. Data, Cloud (AWS), Software", company: "Tone Singleton", ask: "$2,000", variant: "fullstack", lang: "en", hot: 1 },
  { dir: "umbrelly-founding-ai-djinni", id: "djinni:847863", url: "https://djinni.co/jobs/847863-founding-engineer-ai-router-product/", title: "Founding Engineer (AI Router Product)", company: "Umbrelly.Cloud", ask: "$2,500", variant: "fullstack", lang: "en", hot: 1 },
  { dir: "phoenixgame-react-igaming-djinni", id: "djinni:847826", url: "https://djinni.co/jobs/847826-react-frontend-developer-igaming/", title: "React / Frontend Developer (iGaming)", company: "Phoenix Games", ask: "$2,000", variant: "frontend", lang: "en", hot: 0 },
];

const jobs: any[] = [];
const drafts: any[] = [];
for (const q of queued) {
  const dir = join(root, "applications", q.dir);
  const message = readFileSync(join(dir, "message.md"), "utf8");
  const job = readFileSync(join(dir, "job.md"), "utf8");
  const text = readSection(message, /Message \(send this\)/) || readSection(message, /Message/);
  const form = readSection(message, /Form settings/);
  jobs.push({
    id: q.id,
    source: "djinni",
    externalId: q.id.split(":")[1],
    url: q.url,
    title: q.title,
    company: q.company,
    description: job.slice(0, 5000),
    postedAt: "2026-09-12T00:00:00.000Z",
    firstSeenAt: nowIso,
    keywords: JSON.stringify(["legacy"]),
    flags: JSON.stringify(["legacy"]),
    hot: q.hot,
    status: "drafted",
  });
  drafts.push({
    jobId: q.id,
    kind: "application",
    message: text,
    language: q.lang,
    salaryAsk: q.ask,
    resumeVariant: q.variant,
    formNotes: form.replace(/\n+/g, " ").slice(0, 900),
    repoPath: `applications/${q.dir}/`,
  });
}

// Ids the old watcher already showed, so they never come back as cards.
const inboxPath = join(root, "scripts", "legacy-inbox.json");
if (existsSync(inboxPath)) {
  const inbox = JSON.parse(readFileSync(inboxPath, "utf8")) as { jobs: any[] };
  for (const j of inbox.jobs ?? []) {
    const id = `djinni:${j.id}`;
    if (jobs.some((x) => x.id === id)) continue;
    jobs.push({
      id,
      source: "djinni",
      externalId: String(j.id),
      url: j.link,
      title: j.title,
      company: j.company ?? null,
      description: String(j.descriptionText ?? "").slice(0, 3000),
      postedAt: j.postedAt ?? null,
      firstSeenAt: nowIso,
      keywords: JSON.stringify(j.keywords ?? []),
      flags: JSON.stringify(j.flags ?? []),
      status: "skipped",
      filterReason: "legacy-seen",
    });
  }
}

const applications = [
  ["2026-09-09", "Technology Oriented · Middle Frontend", "$2,000", 665, "en", "fullstack", "silent"],
  ["2026-09-09", "Feenko · Full-Stack (Astro, funnels)", "$2,000", 243, "uk", "fullstack", "silent"],
  ["2026-09-09", "Dokport · Full-Stack (React/NestJS)", "$2,000", 123, "en", "fullstack", "silent"],
  ["2026-08-18", "Coralsoft · Strong Junior Full-Stack", "$1,100", 37, "en", "fullstack", "silent"],
  ["2026-08-16", "BVP Software · React (Chrome extension)", "$1,200", 520, "uk", "fullstack", "silent"],
  ["2026-08-14", "QA Roast · Strong Junior Full-Stack", null, 75, "en", "fullstack", "silent"],
  ["2026-08-12", "CML Team · Full-Stack (AI products)", "$1,200", 487, "en", "fullstack", "silent"],
  ["2026-08-10", "IteamDevelopment · Middle Full-Stack", "$1,300", 30, "uk", "fullstack", "silent"],
  ["2026-08-06", "The Fellas Ads · Full Stack", "$1,300", 103, "en", "fullstack", "call"],
  ["2026-08-06", "Duanex · Fullstack (Node + Next)", "$1,300", null, "en", "fullstack", "silent"],
  ["2026-08-06", "TeGem · Full-Stack", "$800", 53, "en", "fullstack", "hired"],
].map(([date, notes, ask, apps, lang, variant, stage]) => ({
  sentAt: `${date}T12:00:00.000Z`,
  salaryAsked: ask,
  appsAtSend: apps,
  language: lang,
  resumeVariant: variant,
  stage,
  stageAt: `${date}T12:00:00.000Z`,
  notes: `legacy: ${notes}`,
}));

const res = await fetch(`${workerUrl()}/api/admin/seed`, {
  method: "POST",
  headers: { authorization: `Bearer ${need("ADMIN_TOKEN")}`, "content-type": "application/json" },
  body: JSON.stringify({ jobs, drafts, applications }),
});
console.log(res.status, await res.text());
