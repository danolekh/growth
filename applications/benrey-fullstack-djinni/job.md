# Benrey — Senior Full-Stack Engineer, Data Product

- **Source:** Djinni.co · https://djinni.co/jobs/848819-senior-full-stack-engineer-data-product/
- **Published:** 17 Sep 2026 · **1 application** (as of draft time). Fresh, hot flag on the queue.
- **Company:** Benrey. A data product mapping gambling regulation across 200+ jurisdictions
  (licensing, tax, advertising and player-protection rules, and how they change). Public,
  content-heavy site today with a research database, an editor CMS, and a daily monitoring
  pipeline over regulators, gazettes and parliaments. Website not confirmed (no domain fetch
  succeeded in the time budget); company type on Djinni reads "Agency" but the post describes
  their own product.
- **Format:** Full Remote · Worldwide · Fulltime · English B2
- **Salary:** $$$$ band (Djinni's top bucket). No number in the post; form prefill unknown.
- **Years required:** 3 (Dan: 3, **exact match** — despite the "Senior" title, the filter is not a stretch).
- **Domain:** Gambling (regulatory/compliance data, not casino operations).

## Raw post (summary)
Two things changing at once: a full front-end redesign (Next.js + TypeScript, with a product
designer who just joined) and a move from public reference site to paid product (accounts,
purchasable reports, a back office). The hire owns: the Next.js web app; a data layer of several
SQLite stores with a strict one-way flow from canonical data to mirrors and validation gates that
refuse silent data loss; a Python monitoring pipeline (crawlers over regulator sites/gazettes/
parliaments, a matching layer, model-based vetting, a Telegram approval bot); LLM pipelines with
fixed schemas where model output is treated as a claim to verify, not a fact; ops on one Linux
server (systemd, a custom deploy script with rollback, DB replication, Cloudflare in front); and
eventually the back office tooling. Small team, async, decisions written down. "AI writes a lot of
our code; your judgement decides what ships."

## Requirements → Dan
| They want | Dan |
|---|---|
| Senior, ships and runs production web apps end to end | **Yes** — Quextro (solo, real users), sportmagaz.com.ua, consolline.com, all shipped and owned end to end |
| Strong TypeScript + React, Next.js specifically | **Yes** — Next.js 14 App Router e-commerce + custom admin panel |
| Python for scripts, crawlers, services | **Partial** — Python is the second language, scripts and LLM work; no crawler-specific experience |
| Solid SQL, validates rather than trusts; SQLite a plus | **Yes** — Postgres + Drizzle daily, hand-rolled data layers, Zod validation; SQLite familiar from Drizzle work |
| Linux ops: systemd, deploys, backups, logs | **Partial** — Docker and Linux daily; deploys have sat behind Vercel/Cloudflare/GitLab CI, not bare-server systemd |
| LLM pipelines, structured output, output as claim not fact | **Strong yes** — Quextro's core feature is an LLM pipeline extracting questions/topics from PDFs; the point was checking the output, not just calling the model |
| Verification mindset, clear async writing | **Yes** — this is how Dan already frames gaps in every proposal |
| Technical SEO (nice) | **Yes** — JSON-LD, dynamic sitemap, Google Merchant feed (sportmagaz.com.ua) |
| Auth/payments/subscriptions from scratch (nice) | **Partial** — next-auth (Google OAuth, magic link), Stripe Checkout + webhooks; no subscriptions/upsells |
| Scraping hostile/JS-heavy sites (nice) | **Gap** — no scraping work claimed |
| Interest in regulation/compliance (nice) | **Adjacent, honestly** — recent contract work on per-brand GEO access/compliance rules for a live platform (unnamed), not gambling-regulation research |

## Stack-ability
Small team, async, written decisions, "your judgement decides what ships" on AI-generated code —
this is close to how Dan already works with Claude Code day to day. One Linux server and systemd
ops is the least familiar piece; framed as a short ramp given Docker/Linux fluency, not a blocker.

## Verdict
**Apply.** The years bar is an exact match, not a stretch, unusual for a "Senior" post. Strongest
angle: the LLM-pipeline-with-verification requirement maps almost exactly onto what Quextro's core
feature already is. Second angle: Postgres/Drizzle validation habits map onto their "canonical to
mirrors, refuse silent data loss" data layer. Name the Python/crawler, bare-server Linux ops, and
scraping gaps plainly. One application on the post as of writing — send fast.
