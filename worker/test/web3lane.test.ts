import { describe, expect, test } from "bun:test";

import { rssVerdict } from "../src/Djinni.ts";
import { isWeb3Source, web3Config, web3Verdict, WEB3_STACK } from "../src/Web3Lane.ts";

describe("web3 lane verdict", () => {
  test("keeps a junior React/wagmi frontend role and marks it hot", () => {
    const v = web3Verdict("Junior Frontend Developer (React, wagmi)", "Ship dashboards with wagmi and viem in TypeScript.", "Remote");
    expect(v.keep).toBe(true);
    expect(v.hot).toBe(true);
    expect(v.flags).toContain("web3");
    expect(v.flags).toContain("junior");
    expect(v.flags).toContain("frontend");
    expect(v.flags).toContain("react");
    expect(v.reason).toBeUndefined();
  });

  test("drops a Rust engineer on the title", () => {
    const v = web3Verdict("Senior Rust Engineer", "Rust, TypeScript tooling, EVM client.", "Remote");
    expect(v.keep).toBe(false);
    expect(v.hot).toBe(false);
    expect(v.reason).toStartWith("title:");
    expect(v.flags).toEqual(["web3"]);
  });

  test("drops a community manager on the title", () => {
    const v = web3Verdict("Community Manager", "Discord, Telegram, web3 community growth.", "Remote");
    expect(v.keep).toBe(false);
    expect(v.reason).toStartWith("title:");
  });

  test("drops US-only roles from the location or the text", () => {
    const byLocation = web3Verdict("Frontend Engineer (React)", "Next.js and viem for a DeFi app.", "Remote - US only");
    expect(byLocation.keep).toBe(false);
    expect(byLocation.reason).toStartWith("region:");
    const byText = web3Verdict("Frontend Engineer (React)", "Must be located in the US. Next.js and viem.", "Remote");
    expect(byText.keep).toBe(false);
    expect(byText.reason).toStartWith("region:");
  });

  test("keeps a remote TypeScript full-stack role, not hot", () => {
    const v = web3Verdict("Full Stack Engineer (TypeScript) – Remote", "Node indexer and a Next.js dashboard, EU time zones.", "Remote, Germany");
    expect(v.keep).toBe(true);
    expect(v.hot).toBe(false);
    expect(v.flags).toContain("web3");
    expect(v.flags).toContain("full-stack");
    expect(v.flags).toContain("typescript");
  });

  test("drops posts with no stack match at all", () => {
    const v = web3Verdict("Payments Platform Engineer", "Java, Kafka, settlement rails.", "Worldwide");
    expect(v.keep).toBe(false);
    expect(v.reason).toBe("no-stack-match");
  });

  test("config loads with the documented sections and the stack regex matches whole words", () => {
    expect(web3Config.maxAgeHours).toBe(72);
    expect(web3Config.titleExclude.length).toBeGreaterThan(10);
    expect(WEB3_STACK.test("smart contracts on the EVM")).toBe(true);
    expect(WEB3_STACK.test("we deliver web3 products")).toBe(true);
    expect(WEB3_STACK.test("cobwebs and evmore")).toBe(false);
    expect(isWeb3Source("hireweb3")).toBe(true);
    expect(isWeb3Source("djinni")).toBe(false);
  });
});

describe("web3 flag on the Djinni lane", () => {
  test("a TypeScript post mentioning Solidity is kept and flagged web3", () => {
    const v = rssVerdict({ title: "Full Stack Developer", ageHours: 3 }, "React, TypeScript, Solidity smart contracts, wagmi.");
    expect(v.keep).toBe(true);
    expect(v.flags).toContain("web3");
  });

  test("solidity and blockchain titles are no longer excluded", () => {
    const v = rssVerdict({ title: "Blockchain Frontend Engineer (Solidity, React)", ageHours: 3 }, "React, viem.");
    expect(v.keep).toBe(true);
  });

  test("the narrowed account and finance excludes leave engineering titles alone", () => {
    expect(rssVerdict({ title: "Account Manager", ageHours: 3 }, "React").keep).toBe(false);
    expect(rssVerdict({ title: "Financial Analyst", ageHours: 3 }, "React").keep).toBe(false);
    expect(rssVerdict({ title: "Full Stack Engineer (accounts & finance product)", ageHours: 3 }, "React and TypeScript").keep).toBe(true);
  });
});
