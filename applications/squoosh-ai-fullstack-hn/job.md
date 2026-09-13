# Squoosh.AI — Full-Stack Engineer

- **Source:** Hacker News "Who is hiring" (Sep 2026 thread) · https://news.ycombinator.com/item?id=49662536
- **Published:** 11 Sep 2026. HN gives no views/applicant count (thread comment, not a tracked post).
- **Company:** Squoosh.AI (squoosh.ai). Builds AI systems that simulate how people explore digital
  experiences, so commerce teams can evaluate and improve their websites. Two roles open in the same
  thread comment; this is the engineering one (the other is a part-time PhD Researcher role, US-only,
  not relevant).
- **Format:** Full Remote, full-time. No explicit US-only clause on this role (the "US work
  authorization required" line reads as attached to the PhD Researcher role, which is separately
  marked "REMOTE US"; the Full-Stack Engineer line just says "REMOTE").
- **Salary:** $90k-150k/year, stated directly (not a Djinni-style band).
- **Years required:** none stated. "Strong projects and early-career builders welcome."
- **Apply:** email tyler@squoosh.ai, subject "HN — Full Stack", with resume/CV, a shareable work
  sample, and a note on personal contribution.

## Raw post (abridged)
"We build AI systems that simulate how people explore digital experiences, helping commerce teams
evaluate and improve websites. Full-Stack Engineer — $90k-150k USD/year. Own features across the UI,
APIs, and data layer; turn tickets into small, tested PRs and follow them through release. Relevant
stack: React/Next.js, TypeScript, Python APIs, Postgres, browser automation. We want someone who uses
AI coding tools well and can independently debug and validate what they ship. Strong projects and
early-career builders welcome."

## Requirements → Dan
| They want | Dan |
|---|---|
| React / Next.js | **Yes** — Next.js 14 App Router e-commerce build, React 19 on Azulejo and Quextro |
| TypeScript | **Yes**, primary language, daily |
| Own features UI → API → data layer, small tested PRs | **Yes** — this is the day job: iGaming microservices end to end, plus Quextro solo |
| Postgres | **Yes** — Drizzle + Postgres in production (Renewator, Azulejo, Quextro) |
| Python APIs | **Partial/gap** — Python is a second language for scripts and LLM work, not a production API toolchain |
| Browser automation | **Gap** — no shipped browser-automation work |
| Uses AI coding tools well, debugs/validates independently | **Yes** — Claude Code daily on real feature work, reviews everything before it ships |
| Years of experience | **None stated**, "early-career builders welcome" — no filter risk |

## Stack-ability
Full-time, US-range salary but role reads open to remote generally (not US-only like the PhD slot).
Small AI startup, ships fast, wants independent debugging - reads as low-oversight and a good stack
match apart from the two named gaps.

## Verdict
**Apply.** Core stack (React/Next.js, TypeScript, Postgres, own-the-feature ownership) lines up
directly, no years bar, and the two gaps (Python APIs, browser automation) are small enough to name
plainly rather than disqualify. Angle: Azulejo as the work sample (solo-built e-commerce, UI through
Postgres/Drizzle data layer, exactly the shape they describe), Quextro for solo ownership, the iGaming
work for production Postgres ownership, and daily Claude Code use for the AI-tooling ask.
