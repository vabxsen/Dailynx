import { doc, runTransaction } from "firebase/firestore";

import { db } from "../firebase/firebase";

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

export interface UsernameClaimResult {
  username: string;
  usernameEditsUsed: number;
}

/**
 * Claims a new username, enforcing global uniqueness (via a reservation doc
 * per lowercase username) and the one-time-change rule: the first username a
 * user sets is free, one change is allowed after that, then it's locked
 * forever. Mirrors the same constraints enforced server-side in
 * firestore.rules, so this can't be bypassed by writing to Firestore directly.
 */
export async function claimUsername(
  uid: string,
  rawUsername: string,
  current: { username: string; usernameEditsUsed: number }
): Promise<UsernameClaimResult> {
  const next = rawUsername.trim().toLowerCase();
  const oldUsername = current.username || "";

  if (!USERNAME_PATTERN.test(next)) {
    throw new Error(
      "Usernames must be 3-20 characters: lowercase letters, numbers, or underscores."
    );
  }

  if (next === oldUsername) {
    return { username: oldUsername, usernameEditsUsed: current.usernameEditsUsed };
  }

  if (oldUsername !== "" && current.usernameEditsUsed >= 1) {
    throw new Error("You've already used your one-time username change.");
  }

  const userRef = doc(db, "users", uid);
  const newUsernameRef = doc(db, "usernames", next);
  const oldUsernameRef = oldUsername ? doc(db, "usernames", oldUsername) : null;
  const nextEditsUsed = oldUsername === "" ? current.usernameEditsUsed : current.usernameEditsUsed + 1;

  await runTransaction(db, async (tx) => {
    const newSnap = await tx.get(newUsernameRef);

    if (newSnap.exists() && newSnap.data()?.uid !== uid) {
      throw new Error("That username is already taken.");
    }

    tx.set(newUsernameRef, { uid });
    if (oldUsernameRef) tx.delete(oldUsernameRef);

    tx.set(
      userRef,
      { username: next, usernameEditsUsed: nextEditsUsed },
      { merge: true }
    );
  });

  return { username: next, usernameEditsUsed: nextEditsUsed };
}
