import { describe, expect, test } from "bun:test";

import { isDiscordUrl, splitQuestions, unwrap } from "../src/Text.ts";

describe("unwrap", () => {
  const wrapped = "Your post says the agents handle the typing - that's already how I\nwork day to day. I run Claude Code on real feature work.\n\nBefore that I built Quextro, an ed-tech platform, solo from an empty\nrepo to real users.\n\nPortfolio: danolekh.com";

  test("joins wrapped lines inside a paragraph and keeps paragraph breaks", () => {
    const out = unwrap(wrapped);
    expect(out.split("\n\n").length).toBe(3);
    expect(out).toContain("how I work day to day.");
    expect(out).not.toContain("empty\nrepo");
  });

  test("keeps list lines on their own line", () => {
    const out = unwrap("Two things:\n- first point that is\n  wrapped\n- second point");
    expect(out).toBe("Two things:\n- first point that is wrapped\n- second point");
  });

  test("handles CRLF, squeezes spaces, and is idempotent", () => {
    const once = unwrap("a  b\r\nc\r\n\r\nd");
    expect(once).toBe("a b c\n\nd");
    expect(unwrap(once)).toBe(once);
  });
});

describe("splitQuestions", () => {
  test("strips numbering and bullets", () => {
    expect(splitQuestions("1. What breaks?\n2) Daily routine?\n- Third one\n\nx")).toEqual(["What breaks?", "Daily routine?", "Third one"]);
  });
});

describe("isDiscordUrl", () => {
  test("matches message links only", () => {
    expect(isDiscordUrl("https://discord.com/channels/795981131316985866/796153351372275743/1529802533521")).toBe(true);
    expect(isDiscordUrl("https://discord.gg/effect-ts")).toBe(false);
    expect(isDiscordUrl("https://expand.ai/careers")).toBe(false);
  });
});
