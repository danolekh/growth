import { describe, expect, test } from "bun:test";

import { appliedLine, applyPackage, packageKeyboard, undoKeyboard } from "../src/Cards.ts";

const header = "🟢 <b>Senior Full-Stack</b> · Acme\n$3,000 · Remote";
const form = "<b>Form</b>: fullstack resume";

describe("apply package", () => {
  test("renders the message and the screening answers in copyable blocks", () => {
    const pkg = applyPackage(header, "First paragraph.\n\nSecond <b>para</b>.", form, [{ question: "What breaks?", answer: "Types & tests." }], null, false);
    expect(pkg).toContain("<pre>First paragraph.\n\nSecond &lt;b&gt;para&lt;/b&gt;.</pre>");
    expect(pkg).toContain("<b>What breaks?</b>\n<pre>Types &amp; tests.</pre>");
    expect(pkg).toContain("Paste this");
    expect(pkg).not.toContain("If DMs are closed");
  });

  test("discord layout shows the DM and the thread fallback", () => {
    const pkg = applyPackage(header, "DM text", form, [], "Thread reply", true);
    expect(pkg).toContain("Direct message");
    expect(pkg).toContain("<b>If DMs are closed, reply in the thread:</b>\n<pre>Thread reply</pre>");
  });

  test("keyboard: applied first, questions only when nothing is answered and not discord", () => {
    const url = "https://djinni.co/jobs/1/";
    const plain = packageKeyboard("d1", url, { discord: false, hasAnswers: false, hasQuestions: false });
    expect(plain[0]![0]!.callback_data).toBe("ok:d1");
    expect(plain.flat().map((b) => b.text)).toContain("❓ Questions");
    expect(plain.flat().find((b) => b.url)?.text).toBe("🔗 Open the post");
    const answered = packageKeyboard("d1", url, { discord: false, hasAnswers: true, hasQuestions: true });
    expect(answered.flat().some((b) => b.callback_data === "q:d1")).toBe(false);
    const pending = packageKeyboard("d1", url, { discord: false, hasAnswers: false, hasQuestions: true });
    expect(pending.flat().map((b) => b.text)).toContain("❓ Answers pending");
    const discord = packageKeyboard("d1", "https://discord.com/channels/1/2/3", { discord: true, hasAnswers: false, hasQuestions: false });
    expect(discord.flat().find((b) => b.url)?.text).toBe("💬 Open in Discord");
    expect(discord.flat().some((b) => b.callback_data === "q:d1")).toBe(false);
  });

  test("collapsed line and undo", () => {
    expect(appliedLine("Dev <1>", "Acme")).toBe("✅ <b>Applied</b> · Dev &lt;1&gt; · Acme");
    expect(appliedLine("Dev", null)).toBe("✅ <b>Applied</b> · Dev");
    expect(undoKeyboard("app1")[0]![0]!.callback_data).toBe("n:app1");
  });
});
