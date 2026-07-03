import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export interface Profile {
  displayName: string;
  username: string;
  bio: string;
}

export const EMPTY_PROFILE: Profile = {
  displayName: "",
  username: "",
  bio: "",
};

export async function getProfile(uid: string): Promise<Profile | null> {
  const snap = await getDoc(doc(db, "users", uid));

  return snap.exists() ? (snap.data() as Profile) : null;
}

export async function saveProfile(uid: string, profile: Profile) {
  await setDoc(doc(db, "users", uid), profile, { merge: true });
}
