import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export interface Profile {
  displayName: string;
  username: string;
  bio: string;
  // How many times the username has been changed since it was first set.
  // Capped at 1 — the first set is free, one change is allowed after that,
  // then it's locked forever. Enforced both here and in firestore.rules.
  usernameEditsUsed: number;
}

export const EMPTY_PROFILE: Profile = {
  displayName: "",
  username: "",
  bio: "",
  usernameEditsUsed: 0,
};

export async function getProfile(uid: string): Promise<Profile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;

  const data = snap.data();

  return {
    displayName: (data.displayName as string) ?? "",
    username: (data.username as string) ?? "",
    bio: (data.bio as string) ?? "",
    usernameEditsUsed: (data.usernameEditsUsed as number) ?? 0,
  };
}

/** Saves display name / bio. Username changes go through claimUsername instead. */
export async function saveProfile(
  uid: string,
  patch: Pick<Profile, "displayName" | "bio">
) {
  await setDoc(doc(db, "users", uid), patch, { merge: true });
}
