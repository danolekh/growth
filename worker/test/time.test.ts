import { describe, expect, test } from "bun:test";

import { inSlot, isoWeekOf, localTime } from "../src/Time.ts";

describe("time", () => {
  test("vienna local time in summer is UTC+2", () => {
    const t = localTime(new Date("2026-09-13T06:30:00Z"));
    expect(t.date).toBe("2026-09-13");
    expect(t.hour).toBe(8);
    expect(t.minute).toBe(30);
    expect(t.weekday).toBe(0);
  });
  test("iso week", () => {
    expect(isoWeekOf("2026-09-13")).toBe("2026-W37");
    expect(isoWeekOf("2026-01-01")).toBe("2026-W01");
  });
  test("slot membership is a five-minute window", () => {
    const t = localTime(new Date("2026-09-13T06:33:00Z"));
    expect(inSlot(t, "08:30")).toBe(true);
    expect(inSlot(t, "08:35")).toBe(false);
  });
});
