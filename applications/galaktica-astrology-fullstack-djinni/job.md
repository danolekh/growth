# Galaktica — Full Stack Developer (Astrology / Jyotish)

- **Source:** Djinni.co · https://djinni.co/jobs/850241-full-stack-developer-astrology/
- **Published:** 25 September 2026 · 25 views · **5 applications** (posted today, very fresh)
- **Company:** Galaktica — Ukrainian product IT company since 2019, 400+ people, mobile apps and
  web products for Tier-1 markets. Active wartime charity work (vehicles, drones, two foundations
  for veteran rehab and military families). Opening a new vertical: Vedic astrology (Jyotish), and
  hiring the engineer to lead its technical core.
- **Format:** Full Remote (or hybrid Kyiv/Lviv/Odesa/Larnaca) · Fulltime · English B1-B2
- **Salary:** $$$ (no visible band)

## Raw post (abridged, translated)
New domain vertical in Vedic astrology (Jyotish). Responsibilities: build the calculation core
(turn astrological rules and math into clean, tested, reproducible code), design the architecture
and database for the new vertical, build a REST API (endpoints, validation, versioning, docs),
integrate an LLM (content-generation pipelines, prompt design, quality control on interpretations),
build internal web UIs (input forms, data screens), work with the Product Manager to decompose
requirements, and validate calculations with domain experts.

Requirements: hands-on experience building astrology products or apps (chart calculators, natal
charts, horoscopes) and understanding of the domain (Western astrology or Jyotish); 3+ years
commercial Node.js + TypeScript; deep production NestJS (modular structure, DI, guards,
validation); PostgreSQL + Prisma (or another ORM and willingness to switch quickly); experience
integrating LLM providers (OpenAI / Gemini / LangChain) and prompt-building; solid React for
building internal working interfaces; test coverage with Jest (unit + integration); English B2.
Nice to have: Jyotish knowledge specifically, LangChain/LangGraph AI-agent experience,
Socket.IO/WebSockets, AWS S3, Docker, CI/CD, active use of AI coding assistants (Claude Code,
Cursor).

## Requirements → Dan
| Requirement | Dan |
|---|---|
| Astrology/Jyotish product experience | **Gap.** None. The post pairs this with "validate calculations with domain experts", so it reads as domain support, not solo authorship of the astrology, but it's still an honest zero to name |
| 3+ years commercial Node.js + TypeScript | **Yes** |
| Deep production NestJS (DI, guards, validation) | **Partial.** Production Node has been Express (iGaming microservices, 2026); NestJS is Radency internal tooling (Vue/NestJS), not the deep-modular production depth they want |
| PostgreSQL + Prisma | **Partial.** Postgres daily, ORM is Drizzle not Prisma, but the post explicitly allows switching quickly |
| LLM provider integration, prompt design | **Yes.** Quextro's core feature is an LLM pipeline extracting questions and topics from PDF exam papers |
| Solid React for internal UIs | **Yes** |
| Jest unit + integration | **Partial.** Testing is Vitest + Testing Library, same discipline, different runner |
| English B2 | Unverified, no strong signal either way |
| AI coding assistants (Claude Code, Cursor) — nice to have | **Yes, strong.** Daily Claude Code use is a real differentiator here |

## Stack-ability
Ukrainian product company, remote-first, async-friendly benefits (unlimited day-offs, flexible
sick leave). New vertical means green-field ownership of the calculation core and API, which
matches Dan's solo-ownership pattern (Quextro). Standard 10:00-18:30 hours, not stated as flexible
by the hour, so likely closer to a normal full-time cadence than the low-touch stacked roles.

## Verdict
**Apply.** Posted today, 5 applications, real product company with a specific and unusual brief.
Angle: lead with the Node/TS production strength and the LLM pipeline from Quextro (the closest
proof to "integrate an LLM, build prompts, control output quality"), name the NestJS depth and the
zero astrology experience plainly in one paragraph, and use the Claude Code line since it's on
their own wishlist. The astrology gap is real but the post itself pairs the calculation work with
domain-expert validation, so it reads as learnable rather than disqualifying.
