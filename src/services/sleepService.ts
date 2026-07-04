import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export interface SleepLog {
  id: string;
  uid: string;
  date: string; // wake date, local "YYYY-MM-DD" — one log per date
  bedtime: string; // "HH:MM" (24h)
  wakeTime: string; // "HH:MM" (24h)
  durationMinutes: number;
  createdAt: number;
}

export const DEFAULT_SLEEP_GOAL_MINUTES = 8 * 60;

export async function getSleepLogs(uid: string): Promise<SleepLog[]> {
  const q = query(collection(db, "sleepLogs"), where("uid", "==", uid));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<SleepLog, "id">),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Creates the log for a date, or updates it if one already exists. */
export async function saveSleepLog(
  uid: string,
  existingId: string | null,
  date: string,
  bedtime: string,
  wakeTime: string,
  durationMinutes: number
) {
  if (existingId) {
    await updateDoc(doc(db, "sleepLogs", existingId), {
      bedtime,
      wakeTime,
      durationMinutes,
    });
    return;
  }

  await addDoc(collection(db, "sleepLogs"), {
    uid,
    date,
    bedtime,
    wakeTime,
    durationMinutes,
    createdAt: Date.now(),
  });
}

export async function deleteSleepLog(id: string) {
  await deleteDoc(doc(db, "sleepLogs", id));
}

export async function getSleepGoalMinutes(uid: string): Promise<number> {
  const snap = await getDoc(doc(db, "users", uid));
  return (snap.data()?.sleepGoalMinutes as number) ?? DEFAULT_SLEEP_GOAL_MINUTES;
}

export async function saveSleepGoalMinutes(uid: string, minutes: number) {
  await setDoc(doc(db, "users", uid), { sleepGoalMinutes: minutes }, { merge: true });
}
