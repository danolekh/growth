import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { descriptionText, detailVerdict, isHot, parseDetail, parseRss, rssVerdict } from "../src/Djinni.ts";

const fx = (name: string) => readFileSync(join(import.meta.dir, "fixtures", name), "utf8");

describe("Djinni RSS", () => {
  const items = parseRss(fx("djinni-rss-fullstack.xml"), Date.parse("2026-09-13T00:00:00Z"));

  test("parses every item with id, link, title and date", () => {
    expect(items.length).toBe(100);
    for (const it of items) {
      expect(it.id).toMatch(/^\d+$/);
      expect(it.link).toStartWith("https://djinni.co/jobs/");
      expect(it.title.length).toBeGreaterThan(0);
      expect(it.postedAt).not.toBeNull();
    }
  });

  test("decodes descriptions lazily into plain text", () => {
    const first = items[0]!;
    const text = descriptionText(first);
    expect(text).not.toContain("<p>");
    expect(text).not.toContain("&lt;");
    expect(text.length).toBeGreaterThan(50);
  });

  test("filters .NET titles and keeps TypeScript posts", () => {
    const net = rssVerdict({ title: "Senior Full Stack .NET Engineer (React)", ageHours: 5 }, "C# and React");
    expect(net.keep).toBe(false);
    const ts = rssVerdict({ title: "FullStack Engineer", ageHours: 5 }, "TypeScript, Node.js, NestJS and AWS");
    expect(ts.keep).toBe(true);
    const stale = rssVerdict({ title: "FullStack Engineer", ageHours: 200 }, "TypeScript");
    expect(stale.reason).toBe("stale");
  });

  test("word-boundary matching does not match 'effective' or 'invite'", () => {
    const v = rssVerdict({ title: "Talent Sourcer", ageHours: 5 }, "effective communicator, we invite you");
    expect(v.keep).toBe(false);
  });
});

describe("Djinni job page", () => {
  const detail = parseDetail(fx("djinni-job-848007.html"));

  test("extracts the public fields", () => {
    expect(detail.company).toBe("MeGaDev");
    expect(detail.salary).toBe("$$$$");
    expect(detail.years_required).toBe(5);
    expect(detail.work_format).toBe("Full Remote");
    expect(detail.countries).toBe("Ukraine");
    expect(detail.english).toBe("B2");
    expect(detail.applications).toBe(39);
    expect(detail.views).toBe(110);
    expect(detail.company_type).toBe("Outstaff");
    expect(detail.employment).toBe("Fulltime");
  });

  test("flags stretch years, ukraine-only and outstaff; five years is not a skip", () => {
    const v = detailVerdict(detail);
    expect(v.skip).toBe(false);
    expect(v.flags).toContain("stretch-years");
    expect(v.flags).toContain("ukraine-only");
    expect(v.flags).toContain("outstaff");
    expect(detailVerdict({ years_required: 6 }).skip).toBe(true);
  });

  test("hot needs ≤3 years and ≤80 applications", () => {
    expect(isHot(5, detail, [])).toBe(false);
    expect(isHot(5, { years_required: 2, applications: 20, work_format: "Full Remote" }, [])).toBe(true);
  });
});
