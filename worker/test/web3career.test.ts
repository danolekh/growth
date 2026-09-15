import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { findJobs, parseWeb3Career, web3CareerUrl } from "../src/Web3Career.ts";
import { web3Config, web3Verdict } from "../src/Web3Lane.ts";

const payload = JSON.parse(readFileSync(join(import.meta.dir, "fixtures", "web3career-api.json"), "utf8"));
const NOW = Date.parse("2026-09-15T12:00:00Z");

describe("web3.career API", () => {
  test("finds the jobs array at the end of the documented envelope", () => {
    expect(findJobs(payload).length).toBe(4);
    expect(findJobs({ data: { jobs: payload[2] } }).length).toBe(4);
    expect(findJobs({ ok: true })).toEqual([]);
    expect(findJobs("string")).toEqual([]);
  });

  test("parses ids, urls, dates, tags in both shapes and strips HTML", () => {
    const jobs = parseWeb3Career(payload, NOW);
    expect(jobs.length).toBe(4);
    const junior = jobs[0]!;
    expect(junior.id).toBe("118201");
    expect(junior.url).toBe("https://web3.career/junior-frontend-developer-react-wagmi-basefolio/118201");
    expect(junior.company).toBe("Basefolio");
    expect(junior.location).toBe("Remote, Worldwide");
    expect(junior.description).not.toContain("<p>");
    expect(junior.description).toContain("wagmi and viem");
    expect(junior.tags).toEqual(["react", "typescript", "wagmi", "viem", "frontend"]);
    expect(junior.postedAt).toBe("2026-09-14T09:12:00.000Z");
    expect(junior.ageHours).toBeCloseTo(26.8, 0);
    expect(jobs[1]!.tags).toEqual(["rust", "protocol", "senior"]);
  });

  test("the lane verdict and the age cut do the right thing on the fixture", () => {
    const jobs = parseWeb3Career(payload, NOW);
    const verdicts = jobs.map((j) => ({ title: j.title, fresh: j.ageHours <= web3Config.maxAgeHours, ...web3Verdict(j.title, j.description, j.location) }));
    expect(verdicts[0]).toMatchObject({ keep: true, hot: true, fresh: true });
    expect(verdicts[1]).toMatchObject({ keep: false, fresh: true });
    expect(verdicts[2]).toMatchObject({ keep: true, hot: false, fresh: true });
    expect(verdicts[3]!.fresh).toBe(false);
  });

  test("the token goes into the query string, encoded", () => {
    expect(web3CareerUrl("ab c")).toBe("https://web3.career/api/v1?token=ab%20c&remote=true&limit=100");
  });
});
