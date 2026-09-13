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

Per-application tailoring: drop a `resume.json` in the application folder with
`{"extends": "fullstack", "headline": "…", "summary": "…", "extraBullets": {"quextro": [{"p": 0, "text": "…"}]}}`
and run `bun run build.ts --variant applications/<slug>/resume.json` from here.

Before sending: confirm the public name of the current employer in `data/base.json` (currently
"Renewator", the workspace name).
