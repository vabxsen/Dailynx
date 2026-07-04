import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

export interface Todo {
  id: string;
  uid: string;
  text: string;
  done: boolean;
  createdAt: number;
  // Whether XP has already been permanently granted for this task. Only
  // ever flips false -> true, so re-toggling done/undone never re-awards.
  xpAwarded: boolean;
}

/** Undone tasks first, then newest first. */
export function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort(
    (a, b) => Number(a.done) - Number(b.done) || b.createdAt - a.createdAt
  );
}

export async function getTodos(uid: string): Promise<Todo[]> {
  const q = query(collection(db, "todos"), where("uid", "==", uid));
  const snap = await getDocs(q);

  return sortTodos(
    snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Todo, "id">),
      // Guard against older docs written before this field existed.
      xpAwarded: (d.data().xpAwarded as boolean) ?? false,
    }))
  );
}

export async function addTodo(uid: string, text: string) {
  await addDoc(collection(db, "todos"), {
    uid,
    text,
    done: false,
    createdAt: Date.now(),
    xpAwarded: false,
  });
}

export async function toggleTodo(id: string, done: boolean) {
  await updateDoc(doc(db, "todos", id), { done });
}

export async function deleteTodo(id: string) {
  await deleteDoc(doc(db, "todos", id));
}
