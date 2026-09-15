# Web3 lane — source of claims (started 2026-09-15)

Read this before drafting anything for a web3 job. Only claim what is listed here; addresses
and links marked TBD are not live yet and must not be cited until they are filled in.

## The honest angle
Dan is junior in EVM, not junior in engineering. Three years of commercial TypeScript, and a recent
contract building the wallet, ledger and withdrawal services of a live iGaming platform (past tense,
company unnamed unless references are requested; never "fintech" or "crypto"). Hands-on EVM since
September 2026. Before that: held crypto, did a Solidity/dapp tutorial. `~/code/first-dapp` is a stock
scaffold and is never cited as a project.

"How long in web3?" → "Hands-on since September 2026. Before that I held crypto and did tutorials.
In four weeks I shipped a verified USDC escrow on Base, a reorg-safe indexer and effect-viem; the
transferable part is three years of TypeScript and a recent contract building wallet and ledger
services for a live iGaming platform."

## Projects (fill in as they ship)
1. **milestone-escrow** — USDC milestone escrow for freelancers on Base, no admin key. Client funds
   milestones, freelancer submits, client releases or the review window expires and the freelancer
   claims. Foundry, Solidity 0.8, OpenZeppelin (SafeERC20, ReentrancyGuard), unit + fuzz + invariant
   tests, slither in CI. Frontend: wagmi v2 + viem + TanStack Start on Cloudflare Workers.
   - Repo: https://github.com/danolekh/milestone-escrow (TBD until pushed)
   - Base Sepolia: TBD · Base mainnet: TBD · Demo: https://escrow.danolekh.com (TBD)
   - Write-up: https://www.danolekh.com/b/usdc-escrow-on-base (TBD) · Page: /p/milestone-escrow (TBD)
2. **evm-ledger-indexer** — reorg-safe double-entry ledger built from on-chain events (escrow events
   and USDC transfers for a watch-list of addresses). Effect + viem + Cloudflare Workers cron + D1.
   Cursors with block hashes, walk back to the fork point on reorg, idempotent writes keyed on
   (chain, tx hash, log index), journal entries that sum to zero per event, reconcile against
   balanceOf. Status page: https://ledger.danolekh.com (TBD). Repo: TBD. Write-up: TBD.
3. **effect-viem** — viem clients as Effect services: typed errors, retry schedules, Streams for
   blocks and logs. npm: TBD. Repo: TBD. Write-up: TBD.

OSS in flight: wagmi issue #4396 (Foundry plugin, TypeScript) — cite only as "opened" with the link
once the PR exists, "merged" only when merged. Existing merged PRs: opentui #558, code-racer #698/#660/#684/#658.

## Exact claims allowed
- Solidity 0.8 basics, custom errors, events, OpenZeppelin patterns; Foundry: forge tests, fuzz,
  invariant tests with handlers, fork tests, deploy scripts, Basescan verification.
- viem and wagmi v2 in a wallet-connected frontend (injected, Coinbase Wallet, WalletConnect).
- Event indexing with viem getLogs/getBlock, reorg handling, idempotent ingestion, reconciliation.
- Base (Sepolia and mainnet) deploys and verification; USDC (6 decimals) handling.
- Not allowed: production smart-contract experience beyond these repos, audits, Solana/Rust, MEV,
  ERC-4337 (unless the paymaster add-on ships), "years" of anything web3.

## Message shape for web3 posts
1. First two lines: the one shipped project that matches the post, with its live link and Basescan
   address. 2. The money-correctness story, past tense: wallets, ledger, idempotent withdrawals for
   a live iGaming platform. 3. One plain sentence: "I started on EVM in September 2026; here is what
   I shipped since", then the other two links. 4. Name the gap in one line (no production contracts,
   no audits). Resume variant `web3`. Location line for EU/US employers: Vienna, EU time zone.

## Positioning texts
- Headline: Full-stack TypeScript engineer, 3 years. Shipped wallets, ledgers and idempotent
  withdrawals for a live iGaming platform. Now building on EVM: Solidity + Foundry on Base,
  viem/wagmi, Effect. Everything is verified on Basescan.
- X bio: Full-stack TS (3y). Built wallets & ledgers for a live iGaming platform. Now shipping on
  Base: Solidity/Foundry, viem, Effect. Build in public → danolekh.com
- Farcaster bio: TypeScript full-stack, 3 yrs. Shipped money-correct backends (wallets, ledgers,
  idempotent withdrawals). Building on Base: escrow, indexer, effect-viem. Vienna. danolekh.com
- Summary (Djinni; LinkedIn later): Full-stack TypeScript engineer with three years of commercial
  work (React 19, Next.js, TanStack Start, Node/Bun, Effect, Drizzle, Postgres, Redis, Cloudflare
  Workers). My most recent contract was backend work for a live iGaming platform: wallet and ledger
  services, idempotent withdrawals keyed on a ledger index, single-statement bonus expiry with debit,
  abuse limits and per-brand GEO rules. Since September 2026 I build on EVM: a USDC milestone escrow
  on Base (verified contract, fuzz and invariant tests, wallet-connected demo), a reorg-safe
  double-entry event indexer in Effect on Cloudflare D1, and effect-viem, an open-source Effect
  wrapper for viem. I am new to Solidity and honest about it; what I bring is three years of
  shipping production TypeScript and the habit of treating every balance as something that must
  reconcile. Vienna, EU time zone, remote.

## Identity (fill in)
ENS: danolekh.eth (TBD) · Basename: danolekh.base.eth (TBD) · Farcaster: @danolekh (TBD) ·
Deployer address: TBD · GitHub profile README: TBD
