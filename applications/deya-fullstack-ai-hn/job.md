# Deya — Software Engineer (AI x Healthcare)

- **Source:** Hacker News "Who is hiring" · https://news.ycombinator.com/item?id=49528637
- **Published:** 1 Sep 2026 (HN thread). Views/applications not visible on HN.
- **Company:** Deya (deya.health) — building the longitudinal data layer for eye care: captures
  symptoms, treatments, outcomes and ocular images over time, clinician-led, piloting with eye
  doctors, holds a large dataset of eye images captured on smartphones.
- **Format:** New York, NY · Hybrid (NYC) or Remote · Full-time. Competitive salary plus equity.
- **Salary:** not stated (no band, "competitive plus equity").
- **Years required:** not stated.

## Raw post (abridged)
Three roles, all described as high ownership: Software Engineer (AI x Healthcare) — product and
infra from 0 to 1, Next.js, backend, cloud, agentic workflows, longitudinal clinical data;
Mobile Engineer (React Native, Swift, Kotlin) — own the phone-as-clinical-instrument app;
AI Engineer (Computer Vision + LLMs) — vision pipeline turning phone photos into clinical signal
plus LLM systems reasoning over patient history. Applying for the first, Software Engineer
(AI x Healthcare).

## Requirements → Dan
| They want | Dan |
|---|---|
| Next.js | **Yes**, Next.js 14 App Router, shipped a full e-commerce platform on it |
| Backend | **Yes**, Node/Express microservices in production, Bun + Effect.ts at Quextro |
| Cloud | **Yes**: AWS (Quextro), Cloudflare Workers + Hyperdrive (Azulejo), Railway |
| Agentic workflows | **Partial**: Quextro's core LLM algorithm extracts questions/topics from PDF exam papers; no multi-agent framework shipped |
| Longitudinal / clinical data modeling | **No direct healthcare experience.** Closest shape: Azulejo's variant/attribute modeling and the iGaming platform's event-driven, auditable money flows (ledger-indexed idempotency) - both require data that has to stay correct and traceable over time |
| Product + infra "0 to 1" ownership | **Yes**, Quextro built solo end to end |

## Stack-ability
Full-time, NYC hybrid-or-remote. No explicit US-only restriction in the post, unlike several
others in this thread. Worth testing; if it turns out to require US residency this becomes a
skip on a later reply.

## Verdict
**Apply.** Next.js + backend + cloud is a strong stack match and "0 to 1 ownership" maps directly
to the Quextro story. Healthcare-domain and clinical-data experience are real gaps - name them
plainly, lean on the general shape of correctness-critical, auditable data work instead.
