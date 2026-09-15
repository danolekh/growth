/**
 * The web3 lane: the deterministic verdict shared by the five EVM-flavoured boards
 * (web3.career, CryptoJobsList, hireweb3, remote3, hashtagweb3). Pure, config-driven like the
 * Djinni filters, so it is cheap and testable. Every kept row is flagged `web3` so the scorer
 * switches to the web3 rubric.
 */
import config from "../web3-config.json";

export interface Web3Config {
  mustMatchAny: string[];
  titleExclude: string[];
  titleBoost: string[];
  regionSkip: string[];
  maxAgeHours: number;
}

export const web3Config = config as Web3Config;

export const WEB3_SOURCES = ["web3career", "cryptojobslist", "hireweb3", "remote3", "hashtagweb3"] as const;
export type Web3Source = (typeof WEB3_SOURCES)[number];
export const isWeb3Source = (s: string): s is Web3Source => (WEB3_SOURCES as ReadonlyArray<string>).includes(s);

/** The stack words that earn a `web3` flag on any lane (Djinni RSS, Hacker News, email). */
export const WEB3_STACK = /\b(solidity|web3|blockchain|evm|viem|wagmi|ethers|foundry|dapp|defi|smart contracts?)\b/i;

const mustMatch = web3Config.mustMatchAny.map((p) => new RegExp(p, "i"));
const titleExclude = web3Config.titleExclude.map((p) => new RegExp(p, "i"));
const titleBoost = web3Config.titleBoost.map((p) => new RegExp(p, "i"));
const regionSkip = web3Config.regionSkip.map((p) => new RegExp(p, "i"));
const HOT_TITLE = /\b(junior|entry|graduate|associate)\b/i;

export interface Web3Verdict {
  readonly keep: boolean;
  readonly reason?: string;
  readonly flags: string[];
  readonly hot: boolean;
}

/** A boost pattern becomes a flag named after the text it matched: "Full Stack" → "full-stack". */
const boostFlag = (matched: string): string =>
  matched
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const web3Verdict = (title: string, description: string, location: string | null | undefined): Web3Verdict => {
  const flags = ["web3"];
  const drop = (reason: string): Web3Verdict => ({ keep: false, reason, flags, hot: false });

  const excluded = titleExclude.find((re) => re.test(title));
  if (excluded) return drop(`title:${excluded.source}`);

  const hay = `${title}\n${description}`;
  if (!mustMatch.some((re) => re.test(hay))) return drop("no-stack-match");

  const region = `${location ?? ""}\n${description}`;
  const skipped = regionSkip.find((re) => re.test(region));
  if (skipped) return drop(`region:${skipped.source}`);

  for (const re of titleBoost) {
    const m = title.match(re);
    if (m) {
      const flag = boostFlag(m[0]);
      if (flag && !flags.includes(flag)) flags.push(flag);
    }
  }
  return { keep: true, flags, hot: HOT_TITLE.test(title) };
};
