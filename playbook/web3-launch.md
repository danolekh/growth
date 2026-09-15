# Web3 launch — week-1 checklist and the first posts (2026-09-15)

The plan lives in `~/.claude/plans/i-want-to-erase-robust-haven.md` ("web3 lane"). Claims come only
from `me/web3.md`. This file is Dan's to-do list for week 1 and the copy for the first posts.

## Dan's inputs (about 2 hours, in this order)
1. **Etherscan v2 API key** (free): https://etherscan.io/apis → create key → `ETHERSCAN_API_KEY` in
   `~/code/milestone-escrow/.env` (never committed).
2. **Deployer wallet**: a fresh wallet only for deploys. `cast wallet new` → import it with
   `cast wallet import deployer --interactive` (Foundry keystore, `~/.foundry/keystores/deployer`).
   Put ~$10 of ETH on **Base** (bridge or a CEX withdrawal to Base) and ~$30 of ETH on **mainnet**
   for ENS.
3. **Base Sepolia test funds**: CDP faucet https://docs.cdp.coinbase.com/faucets/docs/welcome (needs a
   Coinbase Developer Platform account; 0.1 ETH/day + USDC) or https://faucet.circle.com (USDC).
4. **Reown (WalletConnect) project id** (free): https://cloud.reown.com → new project "milestone-escrow".
5. **web3.career API token** (free): https://web3.career/web3-jobs-api (email + site URL) →
   `WEB3_CAREER_TOKEN=` in `worker/.env`, then `cd worker && CI=1 bunx alchemy deploy --stage prod --yes`.
6. **ENS**: https://app.ens.domains → `danolekh.eth`, 2 years, from the deployer wallet; set avatar,
   `url` = https://www.danolekh.com, `com.github` = danolekh, `com.twitter`, and make it the primary
   name. **Basename**: https://www.base.org/names → `danolekh.base.eth` (needed for Builder Rewards).
7. **Farcaster**: sign up in the mobile app, username `danolekh`, bio from `me/web3.md`, verify the
   deployer address, follow /base, /dev, /ethereum.
8. **GitHub**: fill bio, blog (danolekh.com) and X fields on the profile; pins are set once the
   repos exist (escrow, indexer, effect-viem, terra-and-sol, agriturismo, drizzle-seeder).
9. **X**: bio from `me/web3.md`; follow @wevm_dev, @_jxom, @awkweb, @gakonst, @foundry_rs, @base,
   @buildonbase, @jessepollak, @OpenZeppelin, @ETHGlobal, @EffectTS_.
10. **GitHub CLI**: `brew install gh && gh auth login` on the personal account (danolekh), so the
    three public repos can be created and pushed from here; or create `milestone-escrow`,
    `evm-ledger-indexer`, `effect-viem` and the profile repo `danolekh` empty in the web UI.
11. Tell Claude the deployer address and the Sepolia contract address once deployed; `me/web3.md`
    gets filled in and the site flag flips.

## Posting rhythm (X, mirrored to Farcaster)
Mon "this week", Wed "one thing I learned", Fri "shipped". Images and replies first; links in the
second line or a reply; no hashtags; five real replies in wevm/Base/Foundry threads before posting.

## Week 1 posts (edit freely, keep them true)

**Mon**
> Spent three years shipping TypeScript backends where a wrong balance costs real money (wallets,
> ledgers, idempotent withdrawals). This month I'm taking that habit on-chain: a USDC milestone
> escrow on Base, Foundry + OpenZeppelin, fuzz and invariant tests. Building in public, week 1.

**Wed** (after reviewing the contract)
> One thing I learned writing an escrow in Solidity: "expired" needs slack. `claimExpired` compares
> `block.timestamp` to `submittedAt + reviewWindow` with `>=`, and the test has to cover the exact
> boundary block, because the boundary is where the money moves.
> [image: the boundary test]
> How do you test timing edges in Foundry - `vm.warp` at the edge, or fuzz around it?

**Fri** (after the Sepolia deploy + verification)
> Shipped: milestone-escrow on Base Sepolia, verified.
> Client funds USDC milestones, freelancer submits, client releases or the review window expires
> and the freelancer claims. No admin key, no arbiter.
> N tests, fuzz + one invariant (escrow balance == funded minus released), slither in CI.
> Limitation: no partial releases, no fee-on-transfer tokens.
> Mainnet next week. [Basescan link] [repo]

## Where things stand (update as they land)
- milestone-escrow: contract + tests done 2026-09-15 in `~/code/milestone-escrow` (77 tests, 100%
  coverage, CI + slither configured); GitHub repo not created yet (needs `gh` or the web UI); Sepolia
  deploy needs the Etherscan key + deployer wallet; mainnet + demo in week 2
- Worker web3 lane: live 2026-09-15 (cryptojobslist, hireweb3, remote3, hashtagweb3 scheduled at
  10:00-11:05 Vienna; 28 jobs kept on day one); web3.career waits for the token; web3 cards show but
  stay out of the writer's queue until `WEB3_LIVE=true` in `worker/.env` + redeploy
- Site: hydraulics case study committed (not deployed); writing index + web3 pages behind the
  `WEB3_LIVE` flag / `draft: true` in `~/code/danolekh`; flips with the mainnet deploy
