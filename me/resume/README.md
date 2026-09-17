# Resume generator

`data/base.json` is the single source of truth (roles, bullets tagged by lane, skills, links).
`variants/*.json` pick a lane, a headline, a summary, the role order and how many bullets per role.
`bun run build` renders every variant to `out/Resume-<name>.pdf` and `out/Resume-<name>-no-contacts.pdf`
(the Upwork attachment: no email, LinkedIn or Telegram).

| Variant | Attach when the post is… |
|---|---|
| `fullstack` | full-stack, Node + React, product teams (the default) |
| `frontend` | React/TypeScript frontend, UI-heavy, Figma precision |
| `backend` | Node/Express/Postgres/Redis, services, APIs, iGaming/fintech |
| `astro-perf` | Astro, headless CMS, marketing sites, performance, agencies |
| `web3` | EVM / dapp / web3 posts (claims from `me/web3.md`; fullstack bullets, web3 summary) |

Per-application tailoring: drop a `resume.json` in the application folder with
`{"extends": "fullstack", "headline": "…", "summary": "…", "extraBullets": {"quextro": [{"p": 0, "text": "…"}]}}`
and run `bun run build.ts --variant applications/<slug>/resume.json` from here.

Before sending: confirm the public name of the 2026 contract company in `data/base.json` (currently
"Renewator", the workspace name). Its dates read "2026", never "present".

After a rebuild, run `bun scripts/upload-resumes.ts` from the repo root so Telegram cards attach the
new PDFs (file ids live in the Worker's KV under `tg:file:<variant>`).
