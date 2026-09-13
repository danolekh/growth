/**
 * Vienna wall-clock helpers on top of Effect's DateTime. Cloudflare crons fire in UTC; the
 * summary slot and the Sunday review are Dan's local time, so the tick converts once with a
 * proper zone and everything else reasons in local parts.
 */
import { DateTime, Option } from "effect";

export const ZONE = "Europe/Vienna";

export interface LocalTime {
  readonly date: string; // YYYY-MM-DD
  readonly hour: number;
  readonly minute: number;
  readonly weekday: number; // 0 = Sunday … 6 = Saturday
  readonly isoWeek: string; // YYYY-Www
}

const zone = Option.getOrThrow(DateTime.zoneMakeNamed(ZONE));

const pad = (n: number) => String(n).padStart(2, "0");

export const localTime = (at: Date = new Date()): LocalTime => {
  const zoned = Option.getOrThrow(DateTime.makeZoned(at, { timeZone: zone }));
  const p = DateTime.toParts(zoned);
  const date = `${p.year}-${pad(p.month)}-${pad(p.day)}`;
  return { date, hour: p.hour, minute: p.minute, weekday: p.weekDay, isoWeek: isoWeekOf(date) };
};

/** ISO-8601 week label for a YYYY-MM-DD date (already local, so computed in UTC arithmetic). */
export const isoWeekOf = (date: string): string => {
  const [y, m, d] = date.split("-").map(Number) as [number, number, number];
  const t = new Date(Date.UTC(y, m - 1, d));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = Date.UTC(t.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((t.getTime() - yearStart) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${pad(week)}`;
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
