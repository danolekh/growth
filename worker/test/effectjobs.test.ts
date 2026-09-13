import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { parseEffectJobs } from "../src/EffectJobs.ts";

const html = readFileSync(join(import.meta.dir, "fixtures", "effect-jobs.html"), "utf8");

describe("Effect jobs directory", () => {
  const jobs = parseEffectJobs(html);

  test("parses every card with company, role, location and apply link", () => {
    expect(jobs.length).toBeGreaterThan(10);
    for (const j of jobs) {
      expect(j.company.length).toBeGreaterThan(1);
      expect(j.role.length).toBeGreaterThan(1);
      expect(j.applyUrl).toStartWith("http");
      expect(j.flags).toContain("effect");
    }
  });

  test("reads a known card", () => {
    const freckle = jobs.find((j) => j.company === "Freckle.io");
    expect(freckle?.role).toBe("Full-stack Engineers");
    expect(freckle?.pay).toBe("$160K – $210K + equity");
    expect(freckle?.location).toBe("San Francisco · Remote");
    expect(freckle?.remote).toBe(true);
    expect(freckle?.blurb).toContain("data-enrichment");
  });

  test("marks on-site cards and keeps ids stable", () => {
    const expand = jobs.find((j) => j.company === "Expand.ai");
    expect(expand?.flags).toContain("onsite");
    expect(expand?.id).toBe("expand-ai-founding-engineer");
  });
});
