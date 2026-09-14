/**
 * Small text helpers shared by the API and the cards.
 */

const LIST_LINE = /^(\s*)([-*•]|\d+[.)])\s+/;

/**
 * Removes hard line wraps inside paragraphs while keeping paragraph breaks and list lines.
 * The routine copies markdown wrapped at ~95 columns; Telegram and application forms need
 * one line per paragraph.
 */
export const unwrap = (s: string): string =>
  s
    .replace(/\r\n?/g, "\n")
    .split(/\n[ \t]*\n+/)
    .map((paragraph) => {
      const lines = paragraph
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      let out = "";
      for (const line of lines) out = out === "" ? line : LIST_LINE.test(line) ? `${out}\n${line}` : `${out} ${line}`;
      return out.replace(/[ \t]{2,}/g, " ");
    })
    .filter(Boolean)
    .join("\n\n")
    .trim();

/** One question per line; numbering and bullets stripped; very short lines dropped. */
export const splitQuestions = (s: string): string[] =>
  s
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.replace(LIST_LINE, "").trim())
    .filter((l) => l.length > 2);

export const isDiscordUrl = (u: string): boolean =>
  /^https:\/\/(ptb\.|canary\.)?discord(app)?\.com\/channels\/\d+\/\d+\/\d+/.test(u);
