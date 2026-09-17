# Crew Matrix — Fullstack Next.js / Nest.js Developer

- **Source:** Djinni.co · https://djinni.co/jobs/848781-fullstack-next-js-nest-js-developer/
- **Published:** 17 Sep 2026 · 36 views · **6 applications** (as of 17 Sep, draft time)
- **Company:** Crew Matrix. No public site found from the post (agent-proxy blocked outbound
  lookups to the obvious domains); post gives domain "SaaS", company type "Product".
- **Format:** Full Remote · Countries of Europe or Ukraine · Fulltime · English A2
- **Salary:** $$$, no visible band.
- **Years required:** 3 (Dan: 3, exact match)
- **Flags:** ua-post, ai-tools, **hot**

## Raw post (abridged, Ukrainian)
Looking for a fullstack developer with advanced agentic-coding experience: from context
engineering to agent orchestration. They want someone who doesn't just use AI but builds a real
development process around agents - planning, isolated roles, enforcement via hooks, review in CI.

Key experience wanted:
- Context engineering: `CLAUDE.md` hierarchy, path-scoped rules, skills, hooks.
- Subagents with roles, isolated context and their own toolset (developer / reviewer / QA).
- Orchestration: one session across multiple git repos (`--add-dir`), plan-then-approve → API →
  frontend.
- Routing tasks between agents/models, e.g. Claude Code → v0 for UI, then ported into real code;
  MCP (Jira, Figma, shadcn, etc.).
- Parallel work without conflicts: worktrees / separate feature branches; agent teams.
- Self-check cycles: tests, browser, a review agent before merge, headless Claude Code in CI.

Stack: Next.js, NestJS, TypeORM, PostgreSQL, TypeScript.
Nice to have: GraphQL, multi-tenant, code graphs via MCP, custom internal MCP servers, parallel
review agents on large diffs.

## Requirements → Dan
| They want | Dan |
|---|---|
| Next.js | **Yes**, Next.js 14 App Router e-commerce build with a custom admin panel |
| TypeScript, daily | **Yes**, primary language |
| NestJS | **Gap**: Express is the daily Node backend (production iGaming microservices); NestJS was tooling exposure at Radency, not something shipped solo |
| TypeORM | **Gap**: Drizzle is the daily ORM; comfortable hand-rolling data layers, no TypeORM production time |
| PostgreSQL | **Yes**, daily in production (Drizzle + Postgres, Radency multi-tenant work) |
| Context engineering (CLAUDE.md hierarchy, path-scoped rules, skills, hooks) | **Yes, live proof**: this exact repo runs on a `CLAUDE.md` hierarchy, custom skills and a routine-driven workflow that Dan built and runs daily |
| Subagent roles, isolated context/tools, review-before-merge | **Partial**: uses Claude Code daily and reviews everything it writes; hasn't built formal dev/reviewer/QA subagent role separation or hook-enforced gates |
| Multi-repo orchestration, worktrees, agent teams | **Gap**: not something Dan has set up; single-repo daily use so far |
| Headless Claude Code in CI | **Gap**: CI today is GitHub Actions/GitLab CI running lint/type/test, not agent-driven |
| Custom MCP servers | **Gap**, no MCP server built |
| GraphQL (nice) | **Gap**, not in `me/skills.md` |
| 3 years | **Yes**, exact |

## Stack-ability
Full remote, small-sounding product team, async-friendly given the post is entirely about async
agent workflows rather than meetings. Ukrainian post → Ukrainian message. No salary band, so use
the Ukrainian-company default.

## Verdict
**Apply.** The framework asks (NestJS, TypeORM) are real gaps against Drizzle/Express, but they're
adjacent Node/TS tooling, not a different paradigm. The headline ask - real day-to-day use of
Claude Code with a CLAUDE.md-driven process - is something Dan can point at directly and
honestly: this very repo. Angle: lead with that concrete proof, then the Next.js/Postgres
production work, then name the framework and orchestration-depth gaps plainly.
