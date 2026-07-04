/**
 * Sleep duration / quality math. Pure functions operating on "HH:MM" strings
 * and plain numbers so they're trivial to test, matching utils/streak.ts.
 */

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Minutes asleep between a bedtime and a wake time. If wake time is earlier
 * than or equal to bedtime, the sleep is assumed to cross midnight (the
 * overwhelmingly common case); otherwise it's treated as a same-day nap.
 */
export function computeDurationMinutes(bedtime: string, wakeTime: string): number {
  const diff = toMinutes(wakeTime) - toMinutes(bedtime);
  return diff <= 0 ? diff + 24 * 60 : diff;
}

/** "7h 30m" / "8h" for whole hours. */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export type SleepQuality = "great" | "okay" | "poor";

/** Duration relative to goal: at/above goal is "great", down to 75% is "okay", below that is "poor". */
export function sleepQuality(durationMinutes: number, goalMinutes: number): SleepQuality {
  const ratio = goalMinutes > 0 ? durationMinutes / goalMinutes : 1;
  if (ratio >= 1) return "great";
  if (ratio >= 0.75) return "okay";
  return "poor";
}

export function averageMinutes(durations: number[]): number {
  if (durations.length === 0) return 0;
  return Math.round(durations.reduce((sum, d) => sum + d, 0) / durations.length);
}

/** Percentage (0-100) of nights that met or beat the goal. */
export function goalMetRate(durations: number[], goalMinutes: number): number {
  if (durations.length === 0) return 0;
  const met = durations.filter((d) => d >= goalMinutes).length;
  return Math.round((met / durations.length) * 100);
}
