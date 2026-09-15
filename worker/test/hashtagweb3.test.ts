import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { parseHashtagWeb3 } from "../src/HashtagWeb3.ts";

const json = JSON.parse(readFileSync(join(import.meta.dir, "fixtures", "hashtagweb3-jobs.json"), "utf8"));

describe("hashtagweb3 listings", () => {
  const jobs = parseHashtagWeb3(json, Date.parse("2026-09-15T12:00:00Z"));

  test("keeps only engineering departments from the data array", () => {
    expect(json.data.length).toBe(50);
    expect(jobs.length).toBeGreaterThan(3);
    expect(jobs.length).toBeLessThan(json.data.length);
    for (const j of jobs) {
      expect(j.url).toStartWith("http");
      expect(j.department ?? "Engineering").toMatch(/engineer|develop|software|tech/i);
      expect(j.company).not.toBeNull();
    }
    expect(jobs.some((j) => /Sales Director|Treasury Manager|Recruiter/.test(j.title))).toBe(false);
  });

  test("reads a known remote engineering row with its date", () => {
    const wallets = jobs.find((j) => j.title.startsWith("Backend Engineer - Wallets"));
    expect(wallets?.location).toBe("Remote job");
    expect(wallets?.postedAt).not.toBeNull();
    expect(wallets?.ageHours).toBeGreaterThan(0);
  });

  test("rows without a department pass; inactive rows and bad payloads do not", () => {
    const rows = [
      { id: "1", title: "Engineer", company: "A", link: "https://a/1", date: "2026-09-14T00:00:00Z", location: "Remote", active: true },
      { id: "2", title: "Engineer", company: "A", link: "https://a/2", date: "2026-09-14T00:00:00Z", department: "Engineering", active: false },
      { id: "3", title: "Engineer", company: "A", link: "https://a/3", date: "not a date", department: "Tech" },
    ];
    const parsed = parseHashtagWeb3({ data: rows });
    expect(parsed.map((j) => j.id)).toEqual(["1", "3"]);
    expect(parsed[1]?.postedAt).toBeNull();
    expect(Number.isNaN(parsed[1]!.ageHours)).toBe(true);
    expect(parseHashtagWeb3(null)).toEqual([]);
    expect(parseHashtagWeb3({ data: "nope" })).toEqual([]);
  });
});
