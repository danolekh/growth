# Web3 lane — source of claims (started 2026-09-15)

Read this before drafting anything for a web3 job. Only claim what is listed here; addresses
and links marked TBD are not live yet and must not be cited until they are filled in.

## Lane status (read first)
Drafting is on. Since 2026-09-18 the escrow is deployed and verified on **Base Sepolia, which is a
testnet** — say so in that many words. There is no mainnet deploy, no frontend and no demo, so never
imply mainnet, never link a demo, and never cite the indexer or effect-viem. When more lands, fill it
in here: the routine reads this file on every run, so the next drafts pick it up without a prompt
change.

## The honest angle
Dan is junior in EVM, not junior in engineering. Three years of commercial TypeScript, and a recent
contract building the wallet, ledger and withdrawal services of a live iGaming platform (past tense,
company unnamed unless references are requested; never "fintech" or "crypto"). Hands-on EVM since
September 2026. Before that: held crypto, did a Solidity/dapp tutorial. `~/code/first-dapp` is a stock
scaffold and is never cited as a project.

"How long in web3?" → "Hands-on since September 2026. Before that I held crypto and did tutorials.
Since then I shipped a USDC milestone escrow for Base: deployed and verified on Base Sepolia, 80
tests with fuzz and invariant suites, fork tests against real USDC, Slither in CI, all public. The
transferable part is three years of TypeScript and a recent contract building wallet and ledger
services for a live iGaming platform."

## Projects (fill in as they ship)
1. **milestone-escrow** — LIVE: public repo, deployed and verified on Base Sepolia. USDC milestone escrow for
   freelancers on Base, no admin key, no fee, no arbiter. Client funds milestones, freelancer
   submits, client releases or the review window expires and the freelancer claims; either side can
   cancel and the unstarted remainder goes back to the client. Foundry, Solidity 0.8, OpenZeppelin
   (SafeERC20, ReentrancyGuard); funding checks the balance delta, so fee-on-transfer tokens revert.
   80 tests: 72 unit and fuzz, 5 invariants (escrow balance equals funded minus released, no double
   payout), 3 fork tests against real USDC on Base Sepolia. 100% line and branch coverage, Slither in
   CI, README with a threat model and a "what it does not do" list.
   - Repo: https://github.com/danolekh/milestone-escrow (public since 2026-09-15, CI green)
   - Base Sepolia (testnet), deployed and verified 2026-09-18: `0x028FB5C4E093D679f56323a70773bAd7aB864d77`
     https://sepolia.basescan.org/address/0x028fb5c4e093d679f56323a70773bad7ab864d77
   - Base mainnet: TBD
   - Frontend (wagmi v2 + viem + TanStack Start): not built · Demo: https://escrow.danolekh.com (TBD)
   - Write-up: https://www.danolekh.com/b/usdc-escrow-on-base (TBD) · Page: /p/milestone-escrow (TBD)
2. **evm-ledger-indexer** — NOT STARTED, never cite. Planned: reorg-safe double-entry ledger built
   from on-chain events (escrow events and USDC transfers for a watch-list of addresses). Effect +
   viem + Cloudflare Workers cron + D1. Cursors with block hashes, walk back to the fork point on
   reorg, idempotent writes keyed on (chain, tx hash, log index), journal entries that sum to zero per
   event, reconcile against balanceOf. Status page: https://ledger.danolekh.com (TBD). Repo: TBD.
3. **effect-viem** — NOT STARTED, never cite. Planned: viem clients as Effect services: typed errors,
   retry schedules, Streams for blocks and logs. npm: TBD. Repo: TBD.

OSS in flight: wagmi issue #4396 (Foundry plugin, TypeScript) — cite only as "opened" with the link
once the PR exists, "merged" only when merged. Existing merged PRs: opentui #558, code-racer #698/#660/#684/#658.

## Exact claims allowed
Now (backed by the escrow repo):
- Solidity 0.8: custom errors, events, a per-job state machine, OpenZeppelin (SafeERC20,
  ReentrancyGuard), ERC-20 approve/transferFrom with a balance-delta check, USDC (6 decimals).
- Foundry: unit and fuzz tests, invariant tests with handlers, fork tests against real USDC,
  coverage, deploy scripts; Slither in CI.
- Base Sepolia deploy with an encrypted keystore and Basescan (Etherscan v2) source verification.

Only once the matching item above is filled in:
- Base mainnet deploys (needs the mainnet address).
- viem and wagmi v2 in a wallet-connected frontend (needs the demo).
- Event indexing with viem getLogs/getBlock, reorg handling, reconciliation (needs the indexer repo).

Never: production smart-contract experience, audits, Solana/Rust, MEV, ERC-4337 (unless the
paymaster add-on ships), "years" of anything web3.

## Message shape for web3 posts
1. First two lines: milestone-escrow with the verified Base Sepolia address (call it a testnet), the
   repo link and one detail that matches the post (the fuzz and invariant tests for Solidity or
   security posts; the milestone flow and USDC handling for product or frontend posts).
2. The money-correctness story, past tense: wallets, ledger, idempotent withdrawals for a live
   iGaming platform, company unnamed.
3. One plain sentence: "I started on EVM in September 2026, and the escrow is the first thing I
   shipped." Add links to other projects only once they are marked live above.
4. Name the gap in one line: no production contracts, no audits, testnet only so far. For posts that ask for
   wagmi/viem, add that React and TanStack Query are production skills but wagmi/viem are new to me.
Resume variant `web3`. Location line for EU/US employers: Vienna, EU time zone.

## Positioning texts
(Add the mainnet address, demo, indexer and effect-viem back into these as each one ships.)
- Headline: Full-stack TypeScript engineer, 3 years. Shipped wallets, ledgers and idempotent
  withdrawals for a live iGaming platform. Now building on EVM: a USDC escrow for Base in Solidity
  and Foundry, verified on Base Sepolia, with fuzz and invariant tests, public on GitHub.
- X bio: Full-stack TS (3y). Built wallets & ledgers for a live iGaming platform. Now building on
  EVM: Solidity/Foundry, a USDC escrow verified on Base Sepolia. Build in public → danolekh.com
- Farcaster bio: TypeScript full-stack, 3 yrs. Shipped money-correct backends (wallets, ledgers,
  idempotent withdrawals). USDC milestone escrow live on Base Sepolia. Vienna. danolekh.com
- Summary (Djinni; LinkedIn later): Full-stack TypeScript engineer with three years of commercial
  work (React 19, Next.js, TanStack Start, Node/Bun, Effect, Drizzle, Postgres, Redis, Cloudflare
  Workers). My most recent contract was backend work for a live iGaming platform: wallet and ledger
  services, idempotent withdrawals keyed on a ledger index, single-statement bonus expiry with debit,
  abuse limits and per-brand GEO rules. Since September 2026 I have been building on EVM: a USDC
  milestone escrow for Base, deployed and verified on Base Sepolia, with 80 tests including fuzz,
  invariant and fork tests against real USDC, and Slither in CI, all public on GitHub. I am new to Solidity and honest
  about it; what I bring is three years of shipping production TypeScript and the habit of treating
  every balance as something that must reconcile. Vienna, EU time zone, remote.

## Identity (fill in)
ENS: danolekh.eth (TBD) · Basename: danolekh.base.eth (TBD) · Farcaster: @danolekh (TBD) ·
Deployer address: `0x4a850c89fbbb288cc89fc5fb2d2609e523caec2d` (Rabby, keystore `deployer`) ·
GitHub profile README: https://github.com/danolekh/danolekh
