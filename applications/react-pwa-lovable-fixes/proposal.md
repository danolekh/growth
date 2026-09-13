# Application — React PWA Troubleshooting & Bug Fixing (Lovable-built farmers market platform)

## Job
- **Job URL:** https://www.upwork.com/jobs/React-PWA-Troubleshooting-Bug-Fixing_~022078571729770824144/
- **Client signals:** not shown on apply screen (verify spend / payment verified on job page)
- **Budget & type:** Hourly $15–35/hr, Intermediate, <30 hrs/wk, 1–3 months
- **Stack:** React PWA, built with Lovable, hosted on GitHub
- **Raw post:**
  ```
  Looking for a developer to troubleshoot, fix bugs, and polish a React-based PWA for a local
  farmers market/community platform. The project is built with Lovable and hosted on GitHub. The
  ideal candidate will have experience in React and PWA development, with strong problem-solving
  skills to address issues and enhance the application's performance.
  ```

## Fit analysis (rubric from ../../playbook/job-selection.md, rate 1–5)
- Skills fit: 5 — React daily-driver, bug fixing in other people's code proven via OSS, performance
  is the flagship lane. Lovable/AI-codegen cleanup is familiar ground (Dan uses AI codegen daily).
  PWA layer (service worker/manifest) not explicitly in skills.md — addressed honestly, no claimed
  PWA track record.
- Winnability: 4 — vague-ish post but a clear, small shape; 1–3 month hourly relationship; the
  69→99 numbers are almost tailor-made for "enhance the application's performance".
- Value: 4 — $15–35/hr with ongoing-work shape, plus review-banking value.
- Client quality: 3 — local community platform + Lovable suggests a non-technical, budget-aware
  first-time-ish client; hourly protection limits risk.
- **Total / Verdict:** pursue — the perf-rescue proof plus honest AI-codebase fluency is a strong,
  differentiated angle.

## Angle
- The hook: Oasi review numbers (69→99, 16s→<2s) — the post explicitly wants performance enhanced.
- Second beat: Lovable fluency — name the typical failure modes of AI-generated codebases to prove
  he knows this exact terrain.
- De-risk hook: diagnosis-first (repro bugs → prioritized rundown → client picks what gets fixed),
  small first session.
- Client's stated priority: troubleshoot / fix / polish + performance.
- Best-mapping proof: Oasi Kadir, OSS PRs (opentui, code-racer), e-commerce 90+ score.

## Demo plan
- Skip — bug-fix job on their private repo; proof carries it.

## Cover letter (final)

Hi,

On my last Upwork contract I took over a slow production site and finished with the mobile
PageSpeed score up from 69 to 99 and load time down from 16 seconds to under 2. The client's 5.0
review states those numbers: https://www.danolekh.com/p/oasi-kadir

Lovable-built apps are familiar territory. I use AI codegen daily in my own work, so I know the
issues these codebases usually ship with: duplicated components, state scattered across the tree,
missing loading and error states, and re-renders that drag performance down. For the PWA side I'd
also check the service worker and caching behavior early, since a stale cache is a classic source
of confusing bugs in apps like this.

Here's how I'd start: get access to the GitHub repo, reproduce your bug list, then send you a
short prioritized rundown of everything I found, bugs plus quick performance wins, so you decide
what I fix first. Every change lands as a clean commit with a plain-language summary of what was
wrong and what I did.

My profile here is still young, so I'm happy to keep the first session small so you can see how I
work before committing to more.

I'm available now and can start today.

Daniil

## Screening answers

**Describe your recent experience with similar projects**

Most recently I finished an Upwork contract rescuing a slow production site: mobile PageSpeed went
from 69 to 99 and load time from 16 seconds to under 2, and the client's 5.0 review states those
numbers (https://www.danolekh.com/p/oasi-kadir). Before that I built a React e-commerce platform
with a custom admin for 2,000+ products that holds a 90+ performance score. I also fix bugs in
other people's codebases through open source: a merged fix in opentui, the terminal UI library
opencode is built on (https://github.com/anomalyco/opentui/pull/558), and I was a top contributor
to code-racer in 2023 with several merged bug fixes.

**Include a link to your GitHub profile and/or website**

GitHub: https://github.com/danolekh · Website: https://www.danolekh.com · A live project I build
and maintain: https://azulejo.danolekh.com

**What frameworks have you worked with?**

React is my core, up to React 19, and I work in it daily. Around it: Next.js (App Router), Astro,
and TanStack Start/Router/Query on the frontend, Node.js and Bun on the backend, Tailwind for
styling, and Drizzle ORM with PostgreSQL for data.

**Describe your approach to testing and improving QA**

I write tests with Vitest and Testing Library for the logic worth locking down, and I set up
GitHub Actions CI so lint and type checks run on every push. For a bug-fixing project like yours
I'd add a regression test alongside each fix where practical, verify manually on real mobile
devices, and use Lighthouse to catch performance regressions before they ship. Every change goes
in as a clean PR with a short summary of the cause and the fix.

## Apply settings
- Rate: **$30/hr** (upper-mid of the $15–35 range; the perf numbers justify it, and the trust-gap
  data says messaged bids run higher than average — don't discount)
- Apply cost: 10 connects → 147 remaining (balance 157 pre-submit)
- Boost: **bid 7** — 4th place sits at just 6 while the top-3 war is at 55–56. One connect over
  the threshold buys a top-4 slot for ≈ $1.05. Don't join the 55–56 war on a $15–35/hr job.
- Attachment: "Resume - no contacts.pdf"
- Profile highlights: Oasi Kadir Upwork job + Azulejo portfolio piece.

## Status / notes
- **Sent:**
- **Bid:** $30/hr
- **Boost:** planned bid 7
- **Connects spent:**
- **Viewed:**
- **Messaged:**
- **Hired:**
- **Client replies:**
- **Next step:** submit with boost bid 7
