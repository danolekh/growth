/**
 * The growth stack: one Cloudflare Worker (src/Growth.ts) plus the D1 database, KV namespace,
 * email route and cron it declares for itself. State is local (`.alchemy/`, gitignored) per the
 * account's deploy rules; stages keep `prod` and `dev` apart.
 *
 *   bunx alchemy deploy --stage prod --dry-run   # plan
 *   bunx alchemy deploy --stage prod --yes       # ship
 *   bunx alchemy dev --stage dev                 # local miniflare
 */
import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { Effect } from "effect";

import Growth from "./src/Growth.ts";

export default Alchemy.Stack(
  "growth",
  {
    providers: Cloudflare.providers(),
    state: Alchemy.localState(),
  },
  Effect.gen(function* () {
    const worker = yield* Growth;
    return { url: worker.url, name: worker.workerName };
  }),
);
