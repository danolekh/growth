# Antfarm — DApp developer

- **Source:** Djinni.co · https://djinni.co/jobs/849194-dapp-developer/
- **Published:** 20 Sep 2026 · 4 views · **1 application** (as of draft time)
- **Company:** Antfarm. Product/SaaS company, domain unclear beyond the post; couldn't confirm a
  company site in the time budget. Post reads like a crypto-native product team (talks about
  contracts, gas, and transaction UX directly, not agency language).
- **Format:** Full Remote · Worldwide · Product · English B1
- **Salary:** no band shown ($$$ not visible in the feed data).
- **Years required:** post text says "4+ years frontend, including production DApps"; the
  structured Djinni field says 3. Treat the DApp-shipping bar as the real risk, not the year count.
- **Flags:** `web3`, marked hot by the watcher.

## Raw post (abridged)
A DApp lives or dies on what happens when a transaction goes wrong. Build the interfaces between
users and their contracts: wallet connection, signing, and the status/error states around every
on-chain action (rejected tx, wrong network, undeployed contract, a call guaranteed to revert).
Stack: React + TypeScript with viem or wagmi, plus judgment about which values should never be
trusted from the client. Preferred: account abstraction, WalletConnect, multi-chain, EAS/signatures,
OSS web3 tooling contributions.

## Requirements → Dan
| They want | Dan |
|---|---|
| 4+ yrs frontend incl. production DApps | **Gap.** ~3 years commercial TS/React, no shipped DApp frontend |
| Strong TS/React | **Yes** |
| EVM wallet integration experience | **Gap.** Never built a wallet-connected frontend |
| viem or wagmi | **Gap.** Not built yet (`me/web3.md`: "needs the demo") |
| Transaction lifecycle / gas / failure-mode judgment | **Partial.** Knows reverts, require checks and state machines from writing and testing them in Foundry on the contract side, not from shipping the frontend UX around them |
| Client-side trust / on-chain verification judgment | **Partial.** Direct transferable instinct from money-correctness backend work (idempotent withdrawals, ledger reconciliation) |
| Account abstraction / WalletConnect / multi-chain (pref.) | **Gap** |
| EAS / signatures / verifiable credentials (pref.) | **Gap** |
| OSS web3 tooling contributions (pref.) | **Partial.** wagmi issue #4396 opened (Foundry plugin), not merged yet |

## Stack-ability
Full remote, worldwide, product company, fulltime. No team-size signal in the post. Score from the
watcher: 20, verdict apply, hot.

## Verdict
**Apply, clearly a stretch.** The core ask (wallet-connected frontend UX) is the one thing
`me/web3.md` explicitly marks as not built yet. Send it anyway per the playbook's own guidance for
posts that ask for wagmi/viem: lead with the escrow (money-correctness, not frontend), name the
wagmi/viem gap in one plain line, and let the three years of TS/React plus the iGaming
money-correctness story carry it. Resume variant `web3`.
