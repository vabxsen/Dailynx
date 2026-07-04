import { doc, runTransaction, setDoc } from "firebase/firestore";

import { db } from "../firebase/firebase";

export const DEFAULT_HABIT_XP_REWARD = 10;
export const DEFAULT_TASK_XP_REWARD = 5;

export interface XpRewards {
  habitXpReward: number;
  taskXpReward: number;
}

export interface XpAwardResult {
  /** XP actually granted by this call (0 if it was already awarded before). */
  awarded: number;
  totalXpBefore: number;
  totalXpAfter: number;
}

/**
 * Permanently awards XP for completing a habit on a given date, exactly once
 * per date. Runs as a transaction so the habit's `xpAwardedDates` guard and
 * the user's running `xpTotal` move together, even across multiple tabs.
 * Unchecking a habit never calls this, so already-granted XP is untouched.
 */
export async function awardHabitXp(
  uid: string,
  habitId: string,
  dateKey: string,
  amount: number
): Promise<XpAwardResult> {
  const habitRef = doc(db, "habits", habitId);
  const userRef = doc(db, "users", uid);

  return runTransaction(db, async (tx) => {
    const habitSnap = await tx.get(habitRef);
    const userSnap = await tx.get(userRef);

    const awardedDates: string[] = habitSnap.data()?.xpAwardedDates ?? [];
    const totalXpBefore: number = userSnap.data()?.xpTotal ?? 0;

    if (awardedDates.includes(dateKey)) {
      return { awarded: 0, totalXpBefore, totalXpAfter: totalXpBefore };
    }

    const totalXpAfter = totalXpBefore + amount;

    tx.set(
      habitRef,
      { xpAwardedDates: [...awardedDates, dateKey] },
      { merge: true }
    );
    tx.set(userRef, { xpTotal: totalXpAfter }, { merge: true });

    return { awarded: amount, totalXpBefore, totalXpAfter };
  });
}

/**
 * Permanently awards XP for completing a to-do, exactly once. Unchecking a
 * task never calls this, so already-granted XP is untouched.
 */
export async function awardTodoXp(
  uid: string,
  todoId: string,
  amount: number
): Promise<XpAwardResult> {
  const todoRef = doc(db, "todos", todoId);
  const userRef = doc(db, "users", uid);

  return runTransaction(db, async (tx) => {
    const todoSnap = await tx.get(todoRef);
    const userSnap = await tx.get(userRef);

    const alreadyAwarded: boolean = todoSnap.data()?.xpAwarded ?? false;
    const totalXpBefore: number = userSnap.data()?.xpTotal ?? 0;

    if (alreadyAwarded) {
      return { awarded: 0, totalXpBefore, totalXpAfter: totalXpBefore };
    }

    const totalXpAfter = totalXpBefore + amount;

    tx.set(todoRef, { xpAwarded: true }, { merge: true });
    tx.set(userRef, { xpTotal: totalXpAfter }, { merge: true });

    return { awarded: amount, totalXpBefore, totalXpAfter };
  });
}

/** Updates the configurable XP-per-completion defaults for a user. */
export async function saveXpRewards(uid: string, patch: Partial<XpRewards>) {
  await setDoc(doc(db, "users", uid), patch, { merge: true });
}
