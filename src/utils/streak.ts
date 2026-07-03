import { todayKey } from "./date";

/**
 * Habit streak / history math. All functions take the raw `completedDates`
 * array of "YYYY-MM-DD" strings and are pure so they're trivial to test.
 */

/**
 * Consecutive days completed, counting back from today.
 *
 * If today isn't checked yet we anchor on yesterday instead, so an untouched
 * "today" doesn't visually break a streak you're about to continue.
 */
export function currentStreak(
  dates: string[],
  today: string = todayKey()
): number {
  const set = new Set(dates);
  const cursor = new Date(`${today}T00:00:00`);

  // Anchor on today if done, otherwise fall back to yesterday.
  if (!set.has(todayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(todayKey(cursor))) return 0;
  }

  let streak = 0;
  while (set.has(todayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

/** Longest run of consecutive completed days ever recorded. */
export function bestStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...new Set(dates)].sort();

  let best = 1;
  let run = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(`${sorted[i - 1]}T00:00:00`);
    prev.setDate(prev.getDate() + 1);

    run = todayKey(prev) === sorted[i] ? run + 1 : 1;
    best = Math.max(best, run);
  }

  return best;
}

/**
 * Number of completed days in a given month.
 * `month` is 1-based (1 = January). Defaults to the current month.
 */
export function monthlyCount(
  dates: string[],
  year: number = new Date().getFullYear(),
  month: number = new Date().getMonth() + 1
): number {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;

  return dates.filter((d) => d.startsWith(prefix)).length;
}
