import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { parsePage, parseThread } from "../src/HackerNews.ts";

const page0 = JSON.parse(readFileSync(join(import.meta.dir, "fixtures", "hn-whoishiring-page0.json"), "utf8"));

describe("Hacker News who is hiring", () => {
  test("finds the thread from a search result", () => {
    const t = parseThread({ hits: [{ objectID: "49522897", title: "Ask HN: Who is hiring? (September 2026)", created_at: "2026-09-01T15:00:00Z", num_comments: 393 }] });
    expect(t?.id).toBe("49522897");
    expect(parseThread({ hits: [] })).toBeNull();
  });

  test("keeps only top-level, remote, on-stack posts", () => {
    const p = parsePage(page0, "49522897");
    expect(p.pages).toBe(4);
    expect(p.posts.length).toBeGreaterThan(3);
    for (const post of p.posts) {
      expect(post.url).toStartWith("https://news.ycombinator.com/item?id=");
      expect(post.text.toLowerCase()).toMatch(/remote/);
      expect(post.title.length).toBeGreaterThan(8);
    }
  });

  test("flags US-only remote posts and open-region ones", () => {
    const p = parsePage(page0, "49522897");
    const usOnly = p.posts.filter((x) => x.flags.includes("us-only"));
    const open = p.posts.filter((x) => x.flags.includes("open-region"));
    expect(usOnly.length + open.length).toBeGreaterThan(0);
    expect(usOnly.some((x) => open.includes(x))).toBe(false);
  });
});
