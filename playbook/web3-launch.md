# Web3 launch — week-1 checklist and the first posts (2026-09-15)

The plan lives in `~/.claude/plans/i-want-to-erase-robust-haven.md` ("web3 lane"). Claims come only
from `me/web3.md`. This file is Dan's to-do list for week 1 and the copy for the first posts.

## Dan's inputs
Done 2026-09-15: GitHub CLI logged in, Etherscan key (in `~/code/milestone-escrow/.env`), web3.career
token (feed live), site deploy approved and shipped. Still open, in this order:

1. **Wallet** (10 min): install Rabby (browser) or Coinbase Wallet, create a new wallet. This address
   is the public web3 identity: it deploys the contracts and owns the ENS name.
   Do not use `0x25f5…0Cac`; its key appeared in a session log and it is discarded.
2. **Deployer keystore** (2 min, in your own terminal): export the private key from the wallet app,
   run `cast wallet import deployer --interactive`, paste the key, set a password.
3. **Test ETH** on Base Sepolia to that address: https://portal.cdp.coinbase.com/products/faucet or
   https://faucets.chain.link/base-sepolia.
4. **Deploy** (2 min): `cd ~/code/milestone-escrow && make deploy-sepolia`, type the keystore
   password; it deploys and verifies on Basescan. Send Claude the contract address.
5. **ENS** `danolekh.eth` at https://app.ens.domains (~$5/yr + Ethereum fee, budget ~$30 of ETH on
   Ethereum mainnet): connect the wallet, register for 2 years (two transactions about a minute
   apart), set it as the primary name, add avatar, website, GitHub and X records.
6. **Basename** `danolekh.base.eth` at https://www.base.org/names (a few dollars of ETH on Base).
7. **Farcaster** app on the phone: username `danolekh`, bio from `me/web3.md`, connect the wallet
   under Settings → Verified addresses, follow /base, /dev, /ethereum.
8. **GitHub profile** (the CLI token cannot edit it): https://github.com/settings/profile → bio from
   `me/web3.md` (X bio text works), website https://www.danolekh.com, X handle. On the profile page,
   "Customize your pins": milestone-escrow, terra-and-sol, agriturismo, drizzle-seeder.
9. **X**: bio from `me/web3.md`; follow the list in the plan; first post Monday.

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
- milestone-escrow: public at https://github.com/danolekh/milestone-escrow (80 tests, 100% coverage,
  CI with slither); Sepolia deploy waits on the wallet steps above; mainnet + demo in week 2
- Profile README: https://github.com/danolekh/danolekh (live 2026-09-15)
- Worker web3 lane: five feeds live incl. web3.career; web3 cards show, drafting waits for `WEB3_LIVE`
- Site: deployed 2026-09-15 with the hydraulics case study and the /b writing index; web3 pages
  stay behind the `WEB3_LIVE` flag and `draft: true` until the Sepolia address exists
