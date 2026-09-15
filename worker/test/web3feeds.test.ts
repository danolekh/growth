import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { field, lastSegment, parseWeb3Rss } from "../src/Web3Feeds.ts";

const fx = (name: string) => readFileSync(join(import.meta.dir, "fixtures", name), "utf8");

describe("web3 RSS boards", () => {
  test("CryptoJobsList: company from dc:creator, location from media:location, undated", () => {
    const items = parseWeb3Rss(fx("cryptojobslist-jobs.xml"));
    expect(items.length).toBe(100);
    for (const it of items) {
      expect(it.link).toStartWith("https://cryptojobslist.com/jobs/");
      expect(it.id).not.toContain("/");
      expect(it.title.length).toBeGreaterThan(0);
      expect(it.company).not.toBeNull();
      expect(it.description).not.toContain("<p>");
      expect(Number.isNaN(it.ageHours)).toBe(true);
      expect(it.postedAt).toBeNull();
    }
    const binance = items.find((i) => i.company === "Binance");
    expect(binance?.location).toContain("UAE");
    expect(binance?.description).toContain("Binance");
  });

  test("hireweb3: company and location from the hireweb3Jobs namespace, dated", () => {
    const items = parseWeb3Rss(fx("hireweb3-rss.xml"), Date.parse("2023-08-13T00:00:00Z"));
    expect(items.length).toBe(100);
    const near = items.find((i) => i.title === "Software Engineer, Data Platform");
    expect(near?.company).toBe("NEAR Protocol");
    expect(near?.location).toBe("United States / Remote");
    expect(near?.id).toBe("cll8hltsk0002xrgwf2rp7brh");
    expect(near?.postedAt).toBe("2023-08-12T20:46:16.000Z");
    expect(near?.ageHours).toBeGreaterThan(0);
    expect(near?.ageHours).toBeLessThan(24);
  });

  test("remote3: company and region from the 'at Company - Type - Region' line", () => {
    const items = parseWeb3Rss(fx("remote3-rss.xml"), Date.parse("2026-09-15T12:00:00Z"));
    expect(items.length).toBe(8);
    const ihsan = items[0]!;
    expect(ihsan.company).toBe("Ihsan");
    expect(ihsan.location).toBe("Worldwide");
    expect(ihsan.id).toBe("founding-senior-payments-platform-engineer-stablecoin-neobank-ihsan");
    expect(ihsan.postedAt).toBe("2026-09-11T04:00:31.000Z");
    const bybit = items.find((i) => i.description.startsWith("at Bybit - Full-Time - UAE"));
    expect(bybit?.company).toBe("Bybit");
    expect(bybit?.location).toBe("UAE");
  });

  test("field tolerates attributes and namespaces; lastSegment strips query and trailing slash", () => {
    expect(field('<guid isPermaLink="true">https://x/y</guid>', "guid")).toBe("https://x/y");
    expect(field("<dc:creator><![CDATA[Acme]]></dc:creator>", "dc:creator")).toBe("<![CDATA[Acme]]>");
    expect(lastSegment("https://a.b/jobs/slug-1/?ref=rss")).toBe("slug-1");
    expect(lastSegment("urn:uuid:123")).toBe("urn:uuid:123");
  });
});
