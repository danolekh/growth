# Djinni application — Benrey

English post, no language requirement beyond B2.

## Message (send this)

Your line about treating model output as a claim until checked is exactly how I already build. At
Quextro, an ed-tech platform I built solo from an empty repo to real users now used by British
teachers and students, the core feature was an LLM pipeline extracting questions and topics from
PDF exam papers, and half the work was the validation step, since a wrong extraction fails
silently right when someone needs the exam paper.

The rest of your stack is close to my daily one. TypeScript and Next.js are my default stack, most
recently a Next.js App Router e-commerce platform with a custom admin panel for 2,000+ products.
On the data side I hand-roll Postgres schemas with Drizzle, no heavy ORM wrapper, the same
instinct as your one-way flow from canonical data to mirrors: I'd rather write the validation gate
myself than trust a library to catch it.

A recent contract had me on the compliance side of a live iGaming platform: per-brand GEO access
rules end to end, schema through monitoring alerts on threshold crossings. Different product, but
caring whether a rule is actually enforced, not just written down, is the same instinct your
regulation data needs.

Honest gaps: Python is my second language, for scripts and LLM work, not a daily crawler
toolchain, so I'd be ramping on your monitoring pipeline. Docker and Linux are daily tools, but I
haven't owned systemd deploys or backups on a bare server, that side has sat behind Vercel or
Cloudflare on my projects. I haven't scraped hostile or JavaScript-heavy sites either.

On the nice-to-haves: technical SEO is real for me, JSON-LD, dynamic sitemaps and a Google
Merchant feed on an e-commerce build. Payments is Stripe Checkout plus webhooks, not a subscription
system built from scratch.

Based in Vienna, EU time zone, three years commercial TypeScript.

Portfolio: danolekh.com · GitHub: github.com/danolekh (39 repos, merged PRs to opentui and code-racer)

## Form settings
- **Salary expectations:** $2,000. No band number in the post; $$$$ is Djinni's top bucket but
  unquantified, so use the no-band EU/US product-company default.
- **CV:** `me/resume/out/Resume-fullstack.pdf`
- **Timing:** posted today (17 Sep), 1 application, hot flag on the queue. Send now, before the
  applicant count climbs.
