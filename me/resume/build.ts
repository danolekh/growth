#!/usr/bin/env bun
/**
 * Resume generator. One data file, one variant per lane, one HTML template, PDF via headless Chrome.
 *
 *   bun run build.ts                      # every variant in variants/, with and without contacts
 *   bun run build.ts --variant frontend   # one variant (name in variants/, or a path to a JSON file)
 *   bun run build.ts --variant ../../applications/foo-djinni/resume.json   # per-application override
 *
 * A per-application JSON can set "extends": "fullstack" and override headline / summary / order /
 * maxBullets / extraBullets. Output lands in out/ as Resume-<name>.pdf and Resume-<name>-no-contacts.pdf.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const ROOT = import.meta.dir;
const OUT = join(ROOT, "out");
mkdirSync(OUT, { recursive: true });
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

type Bullet = { p?: number; lanes?: string[]; text: string };
type Role = { id: string; company: string; title: string; dates: string; where?: string; bullets: Bullet[] };
type Base = {
  name: string;
  contacts: Record<string, string>;
  experience: Role[];
  projects: { name: string; link?: string; text: string }[];
  openSource: { name: string; text: string }[];
  skills: Record<string, string>;
  education: string;
  languages: string;
};
type Variant = {
  name: string;
  extends?: string;
  lane: string;
  headline: string;
  summary: string;
  maxBullets: number;
  order: string[];
  skillsOrder: string[];
  extraBullets?: Record<string, Bullet[]>;
  skipProjects?: boolean;
};

const base = JSON.parse(readFileSync(join(ROOT, "data", "base.json"), "utf8")) as Base;

function loadVariant(ref: string): Variant {
  const path = ref.endsWith(".json") ? resolve(ref) : join(ROOT, "variants", `${ref}.json`);
  const v = JSON.parse(readFileSync(path, "utf8")) as Partial<Variant>;
  const parent = v.extends ? loadVariant(v.extends) : ({} as Variant);
  const merged = { ...parent, ...v } as Variant;
  if (!merged.name) merged.name = basename(path, ".json");
  return merged;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const linkify = (s: string) =>
  esc(s).replace(/\b((?:[a-z0-9-]+\.)+(?:com|io|dev|app|website)(?:\/[\w\-./#?=&]*)?)/g, '<a href="https://$1">$1</a>');

function pickBullets(role: Role, v: Variant): Bullet[] {
  const extra = v.extraBullets?.[role.id] ?? [];
  const all = [...extra, ...role.bullets].filter((b) => !b.lanes || b.lanes.includes(v.lane));
  const seen = new Set<string>();
  return all
    .sort((a, b) => (a.p ?? 9) - (b.p ?? 9))
    .filter((b) => (seen.has(b.text) ? false : (seen.add(b.text), true)))
    .slice(0, v.maxBullets);
}

function render(v: Variant, withContacts: boolean): string {
  const c = base.contacts;
  const contactBits = [
    c.location,
    withContacts ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : null,
    c.site,
    c.github,
    withContacts ? c.linkedin : null,
    withContacts ? `Telegram ${c.telegram}` : null,
  ].filter(Boolean) as string[];

  const roles = v.order
    .map((id) => base.experience.find((r) => r.id === id))
    .filter((r): r is Role => Boolean(r))
    .map((r) => {
      const bullets = pickBullets(r, v).map((b) => `<li>${linkify(b.text)}</li>`).join("");
      return `
      <section class="role">
        <div class="role-head">
          <div><span class="company">${esc(r.company)}</span> · <span class="title">${esc(r.title)}</span></div>
          <div class="dates">${esc(r.dates)}${r.where ? ` · ${esc(r.where)}` : ""}</div>
        </div>
        <ul>${bullets}</ul>
      </section>`;
    })
    .join("");

  const skills = v.skillsOrder
    .filter((k) => base.skills[k])
    .map((k) => `<div class="skill"><span class="k">${esc(k)}</span><span>${esc(base.skills[k])}</span></div>`)
    .join("");

  const projects = v.skipProjects
    ? ""
    : `<h2>Projects</h2>${base.projects
        .map((p) => `<p><strong>${esc(p.name)}</strong>${p.link ? ` (<a href="https://${esc(p.link)}">${esc(p.link)}</a>)` : ""}: ${linkify(p.text)}</p>`)
        .join("")}`;

  const oss = base.openSource.map((o) => `<li><strong>${esc(o.name)}</strong>, ${linkify(o.text)}</li>`).join("");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(base.name)} – ${esc(v.headline)}</title>
<style>
  @page { size: A4; margin: 11mm 14mm; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 10pt; line-height: 1.34; color: #1a1a1a; }
  a { color: #1a1a1a; text-decoration: none; border-bottom: 1px solid #bbb; }
  h1 { font-size: 20pt; margin: 0; letter-spacing: -0.01em; }
  .headline { font-size: 12pt; color: #333; margin: 2px 0 6px; }
  .contacts { font-size: 9.3pt; color: #444; margin-bottom: 10px; }
  .contacts span + span::before { content: " · "; color: #999; }
  .summary { margin: 0 0 10px; }
  h2 { font-size: 9pt; text-transform: uppercase; letter-spacing: 0.08em; color: #666; margin: 9px 0 4px; padding-bottom: 2px; border-bottom: 1px solid #ddd; }
  .role { margin-bottom: 5px; break-inside: avoid; }
  .role-head { display: flex; justify-content: space-between; gap: 12px; }
  .company { font-weight: 600; }
  .title { color: #333; }
  .dates { color: #555; font-size: 9.3pt; white-space: nowrap; }
  ul { margin: 2px 0 0; padding-left: 16px; }
  li { margin: 1px 0; }
  p { margin: 3px 0; }
  .skills { display: grid; grid-template-columns: 1fr; gap: 2px; }
  .skill { display: grid; grid-template-columns: 78px 1fr; gap: 8px; }
  .skill .k { color: #555; font-size: 9.3pt; padding-top: 1px; }
  .two { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
</style></head>
<body>
  <h1>${esc(base.name)}</h1>
  <div class="headline">${esc(v.headline)}</div>
  <div class="contacts">${contactBits.map((b) => `<span>${b.startsWith("<a") ? b : linkify(b)}</span>`).join("")}</div>
  <p class="summary">${esc(v.summary)}</p>

  <h2>Experience</h2>
  ${roles}

  ${projects}

  <h2>Open source</h2>
  <ul>${oss}</ul>

  <h2>Skills</h2>
  <div class="skills">${skills}</div>

  <div class="two">
    <div><h2>Education</h2><p>${esc(base.education)}</p></div>
    <div><h2>Languages</h2><p>${esc(base.languages)}</p></div>
  </div>
</body></html>`;
}

async function toPdf(html: string, name: string) {
  const htmlPath = join(OUT, `${name}.html`);
  const pdfPath = join(OUT, `${name}.pdf`);
  writeFileSync(htmlPath, html);
  if (!existsSync(CHROME)) {
    console.warn(`Chrome not found at ${CHROME}; wrote ${htmlPath} only`);
    return;
  }
  const proc = Bun.spawn(
    [CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", `--print-to-pdf=${pdfPath}`, `file://${htmlPath}`],
    { stdout: "ignore", stderr: "ignore" },
  );
  await proc.exited;
  console.log(`wrote ${pdfPath}`);
}

async function main() {
  const argv = process.argv.slice(2);
  const i = argv.indexOf("--variant");
  const refs = i > -1 ? [argv[i + 1]] : readdirSync(join(ROOT, "variants")).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
  const onlyContacts = argv.includes("--contacts-only");
  const onlyNoContacts = argv.includes("--no-contacts");
  for (const ref of refs) {
    const v = loadVariant(ref);
    if (!onlyNoContacts) await toPdf(render(v, true), `Resume-${v.name}`);
    if (!onlyContacts) await toPdf(render(v, false), `Resume-${v.name}-no-contacts`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
