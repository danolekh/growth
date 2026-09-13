/**
 * Vienna wall-clock helpers. Cloudflare crons fire in UTC; the summary time and the weekly
 * review are Dan's local time, so the tick converts once and everything else reasons in local.
 */
export const ZONE = "Europe/Vienna";

export interface LocalTime {
  readonly date: string; // YYYY-MM-DD
  readonly hour: number;
  readonly minute: number;
  readonly weekday: number; // 0 = Sunday … 6 = Saturday
  readonly isoWeek: string; // YYYY-Www
}

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: ZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  weekday: "short",
});

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const localTime = (at: Date = new Date()): LocalTime => {
  const parts = Object.fromEntries(fmt.formatToParts(at).map((p) => [p.type, p.value]));
  const date = `${parts.year}-${parts.month}-${parts.day}`;
  const weekday = weekdays.indexOf(parts.weekday ?? "");
  return {
    date,
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    weekday: weekday < 0 ? 0 : weekday,
    isoWeek: isoWeekOf(date),
  };
};

/** ISO-8601 week label for a YYYY-MM-DD date, computed in UTC (the date is already local). */
export const isoWeekOf = (date: string): string => {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  const t = new Date(Date.UTC(y, m - 1, d));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = Date.UTC(t.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((t.getTime() - yearStart) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
};

/** True when `local` falls inside the five-minute slot that starts at `hh:mm`. */
export const inSlot = (local: LocalTime, hhmm: string): boolean => {
  const [h, m] = hhmm.split(":").map(Number) as [number, number];
  return local.hour === h && local.minute >= m && local.minute < m + 5;
};

export const hoursSince = (iso: string | null | undefined, now = Date.now()): number =>
  iso ? (now - new Date(iso).getTime()) / 36e5 : Number.NaN;

export const ago = (iso: string | null | undefined, now = Date.now()): string => {
  const h = hoursSince(iso, now);
  if (Number.isNaN(h)) return "?";
  if (h < 1) return `${Math.max(1, Math.round(h * 60))}m`;
  if (h < 24) return `${Math.round(h)}h`;
  return `${(h / 24).toFixed(1)}d`;
};
