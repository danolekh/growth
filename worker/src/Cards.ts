/**
 * Telegram card text and keyboards. Pure formatting; the webhook decides what to do with taps.
 */
import { escapeHtml, type InlineButton } from "./Telegram.ts";
import { ago } from "./Time.ts";

export interface CardJob {
  readonly id: string;
  readonly source: string;
  readonly title: string;
  readonly company: string | null;
  readonly url: string;
  readonly postedAt: string | null;
  readonly firstSeenAt: string;
  readonly flags: string[];
  readonly hot: boolean;
  readonly detail: Record<string, any> | null;
}

export interface CardScore {
  readonly total: number | null;
  readonly verdict: string;
  readonly summary: string | null;
}

export interface CardDraft {
  readonly id: string;
  readonly kind: string;
  readonly salaryAsk: string | null;
  readonly resumeVariant: string | null;
  readonly language: string | null;
}

const sourceIcon: Record<string, string> = { djinni: "🟢", upwork: "🟩", linkedin: "🔵", hn: "🟠", effect: "🟣" };

export const jobCard = (job: CardJob, score: CardScore | null, draft: CardDraft | null): string => {
  const d = job.detail ?? {};
  const meta = [
    d.salary ? `💰 ${escapeHtml(String(d.salary))}` : null,
    d.years_required != null ? `${d.years_required}y` : null,
    d.work_format ? escapeHtml(String(d.work_format)) : null,
    d.countries ? escapeHtml(String(d.countries)) : null,
    d.english ? escapeHtml(String(d.english)) : null,
    d.applications != null ? `${d.applications} apps` : null,
  ].filter(Boolean);
  const lines = [
    `${job.hot ? "🔥 " : ""}${sourceIcon[job.source] ?? "▫️"} <b>${escapeHtml(job.title)}</b>`,
    `${escapeHtml(job.company ?? "?")} · ${ago(job.postedAt ?? job.firstSeenAt)} old`,
    meta.length ? meta.join(" · ") : null,
    job.flags.length ? `<i>${escapeHtml(job.flags.join(" "))}</i>` : null,
    score ? `Score ${score.total ?? "?"}/20 · ${escapeHtml(score.verdict)}` : null,
    score?.summary ? escapeHtml(score.summary) : null,
    draft ? `Draft ready · ask ${escapeHtml(draft.salaryAsk ?? "?")} · resume ${escapeHtml(draft.resumeVariant ?? "fullstack")}` : null,
    `<a href="${escapeHtml(job.url)}">Open the post</a>`,
  ].filter(Boolean);
  return lines.join("\n");
};

export const draftKeyboard = (draftId: string): InlineButton[][] => [
  [
    { text: "✅ Apply", callback_data: `a:${draftId}` },
    { text: "⏭ Skip", callback_data: `s:${draftId}` },
    { text: "🕓 Later", callback_data: `l:${draftId}` },
  ],
];

export const noDraftKeyboard = (jobId: string): InlineButton[][] => [
  [
    { text: "✍️ Draft it", callback_data: `d:${jobId}` },
    { text: "⏭ Skip", callback_data: `x:${jobId}` },
  ],
];

export const sentKeyboard = (applicationId: string, draftId: string, url: string): InlineButton[][] => [
  [
    { text: "📎 Resume PDF", callback_data: `p:${draftId}` },
    { text: "🔗 Open the post", url },
  ],
  [{ text: "↩️ Didn't send", callback_data: `n:${applicationId}` }],
];

/**
 * The whole apply package in one message: the card header, the text to paste inside a
 * copyable block, and the form settings. Telegram caps a message at 4096 characters; the
 * caller falls back to separate messages when the package is longer.
 */
export const applyPackage = (header: string, message: string, form: string): string =>
  [`✅ <b>Applying</b>`, header, "", "<b>Paste this</b> (tap the block to copy):", `<pre>${escapeHtml(message)}</pre>`, "", form].join("\n");

export const replyKeyboard = (messageId: string): InlineButton[][] => [
  [{ text: "✍️ Draft a reply", callback_data: `r:${messageId}` }],
];

export const formSettingsText = (draft: {
  readonly salaryAsk: string | null;
  readonly resumeVariant: string | null;
  readonly formNotes: string | null;
  readonly language: string | null;
}): string =>
  [
    "<b>Form settings</b>",
    draft.salaryAsk ? `Salary: ${escapeHtml(draft.salaryAsk)}` : null,
    `Resume: ${escapeHtml(draft.resumeVariant ?? "fullstack")}`,
    draft.language ? `Language: ${draft.language}` : null,
    draft.formNotes ? escapeHtml(draft.formNotes) : null,
  ]
    .filter(Boolean)
    .join("\n");
