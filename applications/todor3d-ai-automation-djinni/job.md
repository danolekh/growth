# Todor3D — AI Automation Developer (Junior+)

- **Source:** Djinni.co · https://djinni.co/jobs/848345-ai-automation-developer-junior/
- **Published:** 15 September 2026 · 16 views · **2 applications** (as of draft time) · flagged `hot`
- **Company:** Todor3D. Djinni lists it as an outsource shop; couldn't reach a company site to pull
  a concrete line (todor3d.com and todor3d.com.ua both unreachable), so this is triaged on the post
  alone.
- **Format:** Full Remote · Worldwide · English B1 · Fulltime
- **Salary:** `$` band on Djinni (lowest tier shown, no number). No visible band → default rule.
- **Years required:** 1 (Dan: 3, no filter risk)

## Raw post (abridged, translated)
Looking for an AI Automation Developer who uses AI as the primary development tool and wants to
build automations and AI agents for real business tasks. Must be confident with Claude Code, Codex
or Gemini CLI, have experience with n8n or Make building complex scenarios (branching, nested
workflows, error handling, retries), TypeScript/JavaScript for code nodes and small services,
understand REST APIs/webhooks/auth (tokens, JWT, OAuth), work with data via Airtable and/or SQL,
and use Git and Jira. Nice to have: basic Python, Supabase (Postgres, Edge Functions), deploying
small services (Railway, Docker), writing tests that run separately from the live system. Work is
end to end: understand the task, design the solution, implement, deploy, verify on real data,
support what's live. Remote, said to be varied projects, "friendly team."

## Requirements → Dan
| They want | Dan |
|---|---|
| Claude Code / Codex / Gemini CLI as primary dev tool | **Yes** - this is how Dan already builds daily |
| n8n / Make (branching, nested workflows, error handling, retries) | **Gap** - no hands-on time in either; writes the same logic (branching, retries, error handling) as code, not in a node builder |
| TypeScript/JS for code nodes and small services | **Yes** |
| REST APIs, webhooks, auth (tokens, JWT, OAuth) | **Yes** - session revocation, rate limits on auth routes (Renewator, 2026) |
| Airtable and/or SQL | **Partial** - SQL/Postgres daily via Drizzle, no Airtable |
| Git, Jira | **Partial** - Git with conventional commits yes, Jira not confirmed |
| Python (nice) | **Yes**, second language |
| Supabase incl. Postgres, Edge Functions (nice) | **Yes**, extensive across client projects |
| Deploy small services, Railway/Docker (nice) | **Yes** |
| Tests runnable separate from the live system (nice) | **Yes**, Vitest |

## Stack-ability
Outsource company type, junior+ framing, `$` (lowest) salary tier - modest pay is likely. But the
post reads as end-to-end ownership of a task (design → deploy → support), not embedded in a client
scrum team with dailies, and it's extremely fresh (16 views, 2 applications, posted today). Cheap,
fast send.

## Verdict
**Apply** (queue score 17). The core ask, AI-as-primary-tool, is the one thing Dan can prove better
than almost anyone else applying: he runs Claude Code daily on real feature work. Angle: Quextro's
LLM pipeline (built solo, extracts questions/topics from PDFs, real users) is the closest thing to
"built an AI agent end to end" on his profile. Name the n8n/Make and Airtable gaps plainly, since
the tool is new but the underlying logic isn't.
