import { describe, expect, test } from "bun:test";

/** Mirrors the split in Api.handleUpdate: only the first colon separates the action from the id. */
const parseCallback = (data: string) => {
  const sep = data.indexOf(":");
  return { kind: sep > -1 ? data.slice(0, sep) : data, id: sep > -1 ? data.slice(sep + 1) : "" };
};

describe("callback data", () => {
  test("keeps job ids that contain a colon", () => {
    expect(parseCallback("d:hn:49598051")).toEqual({ kind: "d", id: "hn:49598051" });
    expect(parseCallback("x:djinni:848006")).toEqual({ kind: "x", id: "djinni:848006" });
    expect(parseCallback("a:5ae49b89-53ba-457b-bc66-811e4a4420f7")).toEqual({ kind: "a", id: "5ae49b89-53ba-457b-bc66-811e4a4420f7" });
  });
});

describe("new callbacks", () => {
  test("applied and questions parse like the others and stay under Telegram's 64-byte limit", () => {
    const id = "5ae49b89-53ba-457b-bc66-811e4a4420f7";
    expect(parseCallback(`ok:${id}`)).toEqual({ kind: "ok", id });
    expect(parseCallback(`q:${id}`)).toEqual({ kind: "q", id });
    expect(new TextEncoder().encode(`ok:${id}`).length).toBeLessThanOrEqual(64);
  });
});
