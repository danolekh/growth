# Djinni application — Phoenixgame (Full-Stack Engineer, Node.js + React + AI)

English post, English company.

Angle: near-perfect required-stack match plus two of three "nice to have" lines (AI/LLM, Redis).
Web3 lane per the flags; lead with milestone-escrow using the product/money-correctness framing
(not the Solidity-internals framing), since this is a full-stack/AI role, not a security post.

## Message (send this)

Phoenix Games asking for Node, React, AI and Web3 in one role is basically my last few months lined
up - I've been building on Base since September, a USDC milestone escrow in Solidity and Foundry,
verified on Base Sepolia (a testnet): github.com/danolekh/milestone-escrow,
sepolia.basescan.org/address/0x028fb5c4e093d679f56323a70773bad7ab864d77. A client funds a milestone,
the freelancer submits, and the client releases it or the review window expires and the freelancer
claims it, funding checks the balance delta so fee-on-transfer tokens revert. 80 tests including
fuzz and invariant suites, fork tests against real USDC, Slither in CI, all public.

On the core ask: my last contract was six Node microservices for a live iGaming platform - identity,
gateway, wallet, bonus, casino, notification - built with Express, Drizzle, Postgres and Redis,
event-driven with idempotency keys and session-revocation flows, on Docker and GitLab CI. Before
that I built Quextro solo, an ed-tech platform now used by British teachers and students, where the
core feature was an LLM pipeline that extracts questions and topics from PDF exam papers, so the
AI-feature ask isn't new either, and I use Claude Code daily on real feature work.

Two honest gaps: I use Drizzle as my daily ORM, not Prisma or TypeORM, though the concepts carry
over directly. And my container experience stops at Docker, I haven't run Kubernetes in production.
On the EVM side, I only started in September, so no production contract experience yet and no
audits, and the deploy above is testnet only, no mainnet yet.

Happy to do a task if that's the fastest way to check fit.

Portfolio: danolekh.com · GitHub: github.com/danolekh

## Form settings
- **Salary expectations:** $3,000. `$$$$` is Djinni's top visible tier ("highly competitive... in
  EUR or USD"), full-time EU-remote product company under the web3-lane rule, priced below the
  $3,500 no-band ceiling since the role reads mid-level (2-year bar) despite the "Senior" wording
  in the post body.
- **CV:** `me/resume/out/Resume-web3.pdf` (web3-lane rule: web3 variant whenever the lane applies -
  fullstack would also be defensible given the role, but the rule is explicit)
- **Timing:** 345 applications on a post from 5 Aug - the most crowded of the two Phoenixgame posts,
  send anyway given the near-perfect stack match.
