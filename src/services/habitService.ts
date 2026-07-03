import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export interface Habit {
  id: string;
  uid: string;
  title: string;
  time: string; // "HH:MM" (24h) — used to sort the time table
  createdAt: number;
  completedDates: string[]; // local "YYYY-MM-DD" strings, one per completed day
}

/** Sorts habits by scheduled time; habits without a time go last. */
function byTime(a: Habit, b: Habit): number {
  if (!a.time) return 1;
  if (!b.time) return -1;

  return a.time.localeCompare(b.time);
}

export async function getHabits(uid: string): Promise<Habit[]> {
  const q = query(collection(db, "habits"), where("uid", "==", uid));

  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Habit, "id">),
      // Guard against older docs written before these fields existed.
      completedDates: (docSnap.data().completedDates as string[]) ?? [],
      time: (docSnap.data().time as string) ?? "",
    }))
    .sort(byTime);
}

export async function addHabit(uid: string, title: string, time: string) {
  await addDoc(collection(db, "habits"), {
    uid,
    title,
    time,
    completed: false,
    createdAt: Date.now(),
    completedDates: [],
  });
}

/**
 * Marks a habit done/undone for a specific date.
 * Uses arrayUnion/arrayRemove so the write is atomic and we never overwrite
 * concurrent changes from another device.
 */
export async function setCompletion(
  id: string,
  dateKey: string,
  done: boolean
) {
  await updateDoc(doc(db, "habits", id), {
    completedDates: done ? arrayUnion(dateKey) : arrayRemove(dateKey),
  });
}

export async function deleteHabit(id: string) {
  await deleteDoc(doc(db, "habits", id));
}
