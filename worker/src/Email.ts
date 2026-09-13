/**
 * Inbound mail at jobs@danolekh.com: classification by sender and subject, and extraction of
 * job links from the alert formats Upwork, LinkedIn and Djinni send. Pure functions over the
 * parsed message so they can be tested on saved .eml fixtures.
 */
export type MailKind =
  | "upwork-alert"
  | "linkedin-alert"
  | "linkedin-message"
  | "djinni-alert"
  | "djinni-message"
  | "upwork-message"
  | "unknown";

export interface ParsedMail {
  readonly from: string;
  readonly fromName: string;
  readonly subject: string;
  readonly text: string;
  readonly html: string;
  readonly messageId: string;
  readonly receivedAt: string;
}

export interface ExtractedJob {
  readonly source: "upwork" | "linkedin" | "djinni";
  readonly externalId: string;
  readonly url: string;
  readonly title: string;
  readonly snippet: string;
}

const norm = (s: string) => s.toLowerCase();

export const classify = (mail: ParsedMail): MailKind => {
  const from = norm(mail.from);
  const subject = norm(mail.subject);
  if (from.includes("upwork.com")) {
    if (/job|jobs|posted|new work|match/.test(subject)) return "upwork-alert";
    if (/message|invite|interview|proposal|hired|contract/.test(subject)) return "upwork-message";
    return "upwork-alert";
  }
  if (from.includes("linkedin.com")) {
    if (from.startsWith("jobs-noreply") || /job alert|jobs? for you|new jobs|hiring/.test(subject)) return "linkedin-alert";
    if (from.startsWith("messages-noreply") || from.startsWith("invitations") || /message|inmail|invitation|replied/.test(subject))
      return "linkedin-message";
    return "linkedin-alert";
  }
  if (from.includes("djinni.co")) {
    if (/нов[іи]|ваканс|jobs?|match|підбір/.test(subject)) return "djinni-alert";
    return "djinni-message";
  }
  return "unknown";
};

const dedupe = (jobs: ExtractedJob[]): ExtractedJob[] => {
  const seen = new Set<string>();
  return jobs.filter((j) => (seen.has(j.url) ? false : (seen.add(j.url), true)));
};

const cleanTitle = (s: string) => s.replace(/\s+/g, " ").replace(/^[\s\-–|•]+|[\s\-–|•]+$/g, "").trim();

/** Anchor text around a link in the HTML, as the title; a few hundred chars after it as the snippet. */
const anchorText = (html: string, href: string): { title: string; snippet: string } => {
  const idx = html.indexOf(href);
  if (idx < 0) return { title: "", snippet: "" };
  const after = html.slice(idx, idx + 4000);
  const inner = after.match(/>([^<]{3,200})</);
  const title = inner ? cleanTitle(inner[1]!) : "";
  const snippet = after
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&amp;/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 600)
    .trim();
  return { title, snippet };
};

export const extractJobs = (mail: ParsedMail, kind: MailKind): ExtractedJob[] => {
  const html = mail.html || mail.text;
  const out: ExtractedJob[] = [];
  if (kind === "upwork-alert") {
    for (const m of html.matchAll(/https?:\/\/www\.upwork\.com\/jobs\/[^"'\s<>]*~0?([0-9a-f]{16,})[^"'\s<>]*/gi)) {
      const url = `https://www.upwork.com/jobs/~0${m[1]}`;
      const { title, snippet } = anchorText(html, m[0]!);
      out.push({ source: "upwork", externalId: m[1]!, url, title: title || "Upwork job", snippet });
    }
  } else if (kind === "linkedin-alert") {
    for (const m of html.matchAll(/https?:\/\/www\.linkedin\.com\/(?:comm\/)?jobs\/view\/(\d+)[^"'\s<>]*/gi)) {
      const url = `https://www.linkedin.com/jobs/view/${m[1]}`;
      const { title, snippet } = anchorText(html, m[0]!);
      out.push({ source: "linkedin", externalId: m[1]!, url, title: title || "LinkedIn job", snippet });
    }
  } else if (kind === "djinni-alert") {
    for (const m of html.matchAll(/https?:\/\/djinni\.co\/jobs\/(\d+)-[a-z0-9-]*\/?/gi)) {
      const url = `https://djinni.co/jobs/${m[1]}-${(m[0]!.match(/\/jobs\/\d+-([a-z0-9-]*)/i) || [])[1] ?? ""}/`;
      const { title, snippet } = anchorText(html, m[0]!);
      out.push({ source: "djinni", externalId: m[1]!, url, title: title || "Djinni job", snippet });
    }
  }
  return dedupe(out).filter((j) => !/unsubscribe|settings|preferences/i.test(j.title));
};

/** A short plain-text body for the Telegram preview of a message. */
export const preview = (mail: ParsedMail, max = 500): string => {
  const text = (mail.text || mail.html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
};
