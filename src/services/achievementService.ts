import { doc, runTransaction } from "firebase/firestore";

import { db } from "../firebase/firebase";
import type { Habit } from "./habitService";
import { ACHIEVEMENTS, computeAchievementProgress } from "../utils/achievements";

export interface UnlockedAchievement {
  unlockedAt: number;
}

export type UnlockedAchievementsMap = Record<string, UnlockedAchievement>;

/**
 * Evaluates achievement progress against the given habits and unlocks any
 * newly-qualifying achievements in a single transaction, granting each their
 * one-time XP reward. Safe to call every time habits change — already-
 * unlocked achievements are always skipped, so nothing is ever double-paid.
 * Returns the IDs newly unlocked by this call (empty if none).
 */
export async function evaluateAndUnlockAchievements(
  uid: string,
  habits: Habit[]
): Promise<string[]> {
  const progress = computeAchievementProgress(habits);
  const qualifying = ACHIEVEMENTS.filter((a) => {
    const p = progress.find((x) => x.id === a.id);
    return p !== undefined && p.current >= p.target;
  });

  if (qualifying.length === 0) return [];

  const userRef = doc(db, "users", uid);

  return runTransaction(db, async (tx) => {
    const snap = await tx.get(userRef);
    const unlocked: UnlockedAchievementsMap = snap.data()?.unlockedAchievements ?? {};
    const totalXpBefore: number = snap.data()?.xpTotal ?? 0;

    const newlyUnlocked = qualifying.filter((a) => !unlocked[a.id]);
    if (newlyUnlocked.length === 0) return [];

    const updatedUnlocked = { ...unlocked };
    let xpGain = 0;
    for (const a of newlyUnlocked) {
      updatedUnlocked[a.id] = { unlockedAt: Date.now() };
      xpGain += a.xpReward;
    }

    tx.set(
      userRef,
      { unlockedAchievements: updatedUnlocked, xpTotal: totalXpBefore + xpGain },
      { merge: true }
    );

    return newlyUnlocked.map((a) => a.id);
  });
}
