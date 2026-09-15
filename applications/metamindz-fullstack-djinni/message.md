# Djinni application — Metamindz UK

English post, UK agency, C1 English required. English message.

## Message (send this)

Running two client projects at once with different codebases and priorities is how my last few months went, so switching context between a healthcare platform and an AI product doesn't
scare me.

I'm a full-stack TypeScript developer with three years commercial experience. My most recent contract was production Node.js microservices for an iGaming platform (Express, Drizzle, PostgreSQL, Redis, Docker, GitLab CI) and a React admin UI, and in the same period I delivered an Astro marketing site for a logistics operator with its own deploy pipeline, so separate client relationships and separate pipelines in one week is familiar ground. Before that I shipped a Next.js 14 e-commerce platform with a custom admin panel for
2,000+ products and built Quextro, an ed-tech platform, solo from an empty repo to real users.

On your stack specifically: Next.js, TypeScript and Tailwind are daily work, and my last freelance project was an Astro/Tailwind rebuild that took mobile PageSpeed from 69 to 99 with a 5.0
review (danolekh.com/p/oasi-kadir). Zustand is in my regular toolkit. I haven't used Supabase by
name, but I work with Postgres and Drizzle directly, hand-rolling schemas and migrations,
so the relational and auth patterns underneath are familiar ground, Supabase would be a short ramp
rather than a new concept. I use Claude Code daily on real feature work and review everything it
writes.

On my freelance contracts I owned the client communication directly, so working independently across two projects and talking straight to clients is how I already operate.

Portfolio: danolekh.com · GitHub: github.com/danolekh

## Form settings
- **Salary expectations:** $2,000. No band shown in the post; UK/EU agency doing product-style
  client work → EU/Western default.
- **CV:** `me/resume/out/Resume-fullstack.pdf`
- **Timing:** posted 7 Sep, 143 applications already. Send today anyway, the stack fit is
  strong enough to be worth the shot despite the crowd.

## Screening answers

**Please describe your commercial experience with Supabase. What have you used it for in your
projects?**

I haven't used Supabase specifically in a commercial project. My relational database work has
gone through Postgres directly, mostly with Drizzle ORM: hand-rolled schemas, migrations, and
query work in production, most recently on a live iGaming platform (wallets, bonuses, GEO rules)
and on my own e-commerce build, Azulejo. Supabase sits on top of Postgres and adds auth and
realtime on top, so the core data modeling and migration work transfers directly. I'd expect the
ramp to be short, learning Supabase's auth and client conventions rather than the relational
thinking underneath.

**Please describe your experience with Zustand. What kind of state have you managed with it?**

Zustand is part of my regular toolkit on the frontend. I've used it for client-side UI state that
doesn't belong in the URL or a data-fetching cache: things like cart state, filter and modal
state, and form-adjacent UI state alongside TanStack Query handling the server data. I keep stores
small and scoped to one concern rather than one global store, and pair it with selectors so
components only re-render on the slice of state they actually use.

**Do you have commercial experience with a headless or traditional CMS? If yes, which CMS
platforms have you worked with?**

Yes. I've run Strapi in production: deployed on Railway with Postgres and an object storage
bucket, multi-locale content (i18n), role-based access for Admin and Editor users, public
read-only API permissions, and content modeling built from a schema the client provided. I also
work with Strapi's block-based content rendering on my own site, Azulejo, including search and
pagination over article content. I haven't used a traditional CMS like WordPress commercially,
only Strapi as the headless option.
