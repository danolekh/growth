# BVP Software — ReactJS Developer (Chrome extension, one-time project)

- **Source:** Djinni.co
- **Published:** 11 August 2026 · applied 16 August 2026
- **Competition:** 985 views · 520 applications · response activity "very high", last responded 4 days ago
- **Company:** BVP Software (bvpsoftware.com), ~4 years old, outsourcing/agency
- **Salary field entered:** $1,200
- **Language:** posted in Ukrainian, Ukrainian native required

## Raw post

Привіт,

Шукаємо ReactJs Developer-a для невеликого one-time проекту (можуть потім бути ще проекти). Основне
це знати React та вміти працювати з різними API. Сам проект це розробка chrome extension (попередній
досвід не обов'язковий)

**Technical Requirements**
- Strong experience with ReactJS (hooks, state management) at least 2 years
- Knowledge of JavaScript / TypeScript
- Experience working with REST APIs, fetch, FormData, and handling Blob / File objects
- Understanding of in-memory data flow (no need for backend or file storage)

**Bonus:**
- Familiarity with image processing APIs (e.g. remove.bg, Imgix, Cloudinary)
- Experience building Chrome Extensions

**Required skills experience:** React.js — 1.5 years
**Required languages:** Ukrainian — Native
**Tags:** React, TypeScript, REST API, HTML, CSS

## Fit analysis

Reading between the lines, the build is: a Chrome extension with a React popup/side panel that grabs
images from the page or from the user, POSTs them as multipart FormData to an image-processing API
(remove.bg shaped), takes a Blob back, and shows/downloads it. No backend, no storage, everything in
memory. That is a small, well-bounded job.

**Direct hits:**
- Chrome extensions — built internal ones at Radency used daily by the HR department (`me/experience.md`).
  This is the listed bonus and most applicants won't have it.
- React + TypeScript, hooks, state management — daily work for ~2.5 years commercially.
- FormData / Blob / File / fetch — Azulejo's media pipeline: FormData upload to a Hono server,
  sharp + blurhash processing, R2 storage, plus an AI catalog-image generation flow.
- In-memory data flow — no backend needed here, which suits a one-person scope.

**Honest gaps:**
- Never used remove.bg / Imgix / Cloudinary by name. Say so; the API shape is the same multipart POST
  with a binary response.

**Risk:** 520 applications on a five-day-old post at an outsourcing agency. Odds are low regardless of
fit, so the message has to earn the skim in the first two lines. Cost of applying is one message.

**Verdict:** apply. Cheap, exact skill match, and the Chrome-extension line is a genuine differentiator.
