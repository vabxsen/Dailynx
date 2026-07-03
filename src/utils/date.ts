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
