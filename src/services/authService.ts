import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const provider = new GoogleAuthProvider();

export async function login(): Promise<void> {
  await signInWithPopup(auth, provider);
}

export async function logout(): Promise<void> {
  await signOut(auth);
}