import type { Habit } from "../services/habitService";
import { todayKey } from "./date";
import { currentStreak } from "./streak";

export type AchievementCategory = "streak" | "completions" | "perfectWeek" | "activeDays";

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  threshold: number;
  xpReward: number;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "streak_7", title: "Warming Up", description: "Reach a 7-day streak on any habit", category: "streak", threshold: 7, xpReward: 50 },
  { id: "streak_30", title: "On a Roll", description: "Reach a 30-day streak on any habit", category: "streak", threshold: 30, xpReward: 150 },
  { id: "streak_100", title: "Unstoppable", description: "Reach a 100-day streak on any habit", category: "streak", threshold: 100, xpReward: 500 },

  { id: "completions_10", title: "Getting Started", description: "Complete 10 habit check-ins", category: "completions", threshold: 10, xpReward: 25 },
  { id: "completions_100", title: "Century Club", description: "Complete 100 habit check-ins", category: "completions", threshold: 100, xpReward: 100 },
  { id: "completions_500", title: "Dedicated", description: "Complete 500 habit check-ins", category: "completions", threshold: 500, xpReward: 300 },
  { id: "completions_1000", title: "Legend", description: "Complete 1,000 habit check-ins", category: "completions", threshold: 1000, xpReward: 750 },

  { id: "perfect_week_1", title: "Perfect Week", description: "Complete every habit every day for a full week", category: "perfectWeek", threshold: 1, xpReward: 75 },
  { id: "perfect_week_4", title: "Flawless", description: "Achieve 4 perfect weeks", category: "perfectWeek", threshold: 4, xpReward: 250 },
  { id: "perfect_week_12", title: "Consistency Champion", description: "Achieve 12 perfect weeks", category: "perfectWeek", threshold: 12, xpReward: 600 },

  { id: "active_days_30", title: "Regular", description: "Be active on 30 different days", category: "activeDays", threshold: 30, xpReward: 60 },
  { id: "active_days_100", title: "Habitual", description: "Be active on 100 different days", category: "activeDays", threshold: 100, xpReward: 200 },
  { id: "active_days_365", title: "Year of Progress", description: "Be active on 365 different days", category: "activeDays", threshold: 365, xpReward: 800 },
];

export interface AchievementProgress {
  id: string;
  current: number;
  target: number;
}

/** Best current active streak across all habits (mirrors the Dashboard's "bestActiveStreak"). */
function bestActiveStreakAcrossHabits(habits: Habit[], today: string): number {
  return habits.reduce((max, h) => Math.max(max, currentStreak(h.completedDates, today)), 0);
}

function totalCompletions(habits: Habit[]): number {
  return habits.reduce((sum, h) => sum + h.completedDates.length, 0);
}

function totalActiveDays(habits: Habit[]): number {
  return new Set(habits.flatMap((h) => h.completedDates)).size;
}

/** Monday-start date key for the week containing `dateKey`. */
function weekStartKey(dateKey: string): string {
  const d = new Date(`${dateKey}T00:00:00`);
  const day = d.getDay(); // 0=Sun..6=Sat
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
  return todayKey(d);
}

/**
 * Counts complete Mon-Sun weeks where every habit that already existed
 * before that week started was completed on all 7 days. Weeks with no
 * eligible habits don't count.
 */
function countPerfectWeeks(habits: Habit[], today: string): number {
  const allDates = habits.flatMap((h) => h.completedDates);
  if (allDates.length === 0) return 0;

  const earliestDate = [...allDates].sort()[0];
  const cursor = new Date(`${weekStartKey(earliestDate)}T00:00:00`);
  const currentWeekStart = new Date(`${weekStartKey(today)}T00:00:00`).getTime();

  let perfectWeeks = 0;

  while (cursor.getTime() < currentWeekStart) {
    const weekStartMs = cursor.getTime();
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(cursor);
      d.setDate(d.getDate() + i);
      return todayKey(d);
    });

    const eligibleHabits = habits.filter((h) => h.createdAt <= weekStartMs);

    if (
      eligibleHabits.length > 0 &&
      eligibleHabits.every((h) => weekDates.every((d) => h.completedDates.includes(d)))
    ) {
      perfectWeeks++;
    }

    cursor.setDate(cursor.getDate() + 7);
  }

  return perfectWeeks;
}

export function computeAchievementProgress(
  habits: Habit[],
  today: string = todayKey()
): AchievementProgress[] {
  const currentByCategory: Record<AchievementCategory, number> = {
    streak: bestActiveStreakAcrossHabits(habits, today),
    completions: totalCompletions(habits),
    perfectWeek: countPerfectWeeks(habits, today),
    activeDays: totalActiveDays(habits),
  };

  return ACHIEVEMENTS.map((a) => ({
    id: a.id,
    current: currentByCategory[a.category],
    target: a.threshold,
  }));
}
