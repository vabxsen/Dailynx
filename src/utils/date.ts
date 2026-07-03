/**
 * Returns a local calendar date as "YYYY-MM-DD".
 *
 * We deliberately use the local getFullYear/getMonth/getDate (not toISOString,
 * which is UTC) so a habit "resets" at *your* local midnight, not UTC midnight.
 */
export function todayKey(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/** Returns the date key N days before the given date (default: today). */
export function shiftKey(days: number, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() + days);

  return todayKey(d);
}

/** Ordered list of the last N day-keys ending today (oldest first). */
export function lastNDays(n: number, today: string = todayKey()): string[] {
  const base = new Date(`${today}T00:00:00`);
  const out: string[] = [];

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    out.push(todayKey(d));
  }

  return out;
}
