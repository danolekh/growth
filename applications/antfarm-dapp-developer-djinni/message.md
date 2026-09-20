# Djinni application — Antfarm (DApp developer)

English post, English company. Stretch application: the role is frontend wallet-integration work
(viem/wagmi), which `me/web3.md` marks as not built yet. Leads with the escrow's money-correctness
angle since there's no frontend DApp to point to, names the gap in one plain line per the playbook.

## Message (send this)

I shipped a USDC milestone escrow for Base, deployed and verified on Base Sepolia, a testnet:
github.com/danolekh/milestone-escrow. 80 tests including fuzz and invariant suites, and the whole
point of it was money that has to reconcile: a milestone gets funded, then released or reclaimed
after a review window, with no double payout.

On my last contract I built the wallet and ledger services for a live iGaming platform: idempotent
withdrawals keyed on the ledger index, single-statement bonus expiry with debit, abuse limits on
issuance. That's the same instinct your post describes, treating every value from the client as
something to verify before money moves, just from the backend side.

I started on EVM in September 2026 and the escrow is the first thing I shipped. React and
TypeScript are what I've built in for three years, and I know the contract side of a failed
transaction, reverts, require checks, state machines, from writing and testing them in Foundry.
I don't have the wagmi/viem scars yet. Wallet connection, signing and the frontend error states
around a transaction are new to me, and I don't have a shipped DApp frontend to point to.

What I can offer is the backend discipline around client-side trust and money correctness, three
years of production TypeScript and React, and a fast ramp on the frontend layer. Happy to talk if
that trade is useful to you.

Repo: github.com/danolekh/milestone-escrow
Portfolio: danolekh.com · Vienna, EU time zone

## Form settings
- **Salary expectations:** $3,500. No band shown; full remote worldwide product company, fulltime,
  so the EU/US-remote no-band default applies rather than the Ukrainian-company one.
- **CV:** `me/resume/out/Resume-web3.pdf`
- **Timing:** posted today, 4 views, 1 application, marked hot by the watcher. Send it fresh.
