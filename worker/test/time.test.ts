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

describe("nextCronLocal", () => {
  const { nextCronLocal } = require("../src/Time.ts") as typeof import("../src/Time.ts");
  const hours = [5, 8, 11, 14, 17];
  test("picks the next UTC slot and renders it in Vienna time (CEST = UTC+2)", () => {
    expect(nextCronLocal(hours, new Date("2026-09-14T16:26:00Z"))).toEqual({ label: "19:00", tomorrow: false });
    expect(nextCronLocal(hours, new Date("2026-09-14T09:30:00Z"))).toEqual({ label: "13:00", tomorrow: false });
  });
  test("rolls over to tomorrow after the last slot", () => {
    expect(nextCronLocal(hours, new Date("2026-09-14T17:56:00Z"))).toEqual({ label: "07:00", tomorrow: true });
  });
  test("a slot at exactly now is not 'next'", () => {
    expect(nextCronLocal(hours, new Date("2026-09-14T17:00:00Z"))).toEqual({ label: "07:00", tomorrow: true });
  });
});
