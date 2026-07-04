// One-off migration: reserve a `usernames/{name}` doc for every existing
// user profile that already has a username, so the new uniqueness system
// protects them retroactively. Safe to re-run — already-reserved usernames
// are skipped.
//
// Usage:
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json node scripts/backfill-usernames.mjs

import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error(
    "Set GOOGLE_APPLICATION_CREDENTIALS to your service account key file path first."
  );
  process.exit(1);
}

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

async function main() {
  const usersSnap = await db.collection("users").get();

  let claimed = 0;
  let alreadyReserved = 0;
  let skipped = 0;

  for (const userDoc of usersSnap.docs) {
    const uid = userDoc.id;
    const rawUsername = (userDoc.data().username || "").trim().toLowerCase();

    if (!rawUsername) continue;

    if (!USERNAME_PATTERN.test(rawUsername)) {
      console.warn(
        `Skipping ${uid}: existing username "${rawUsername}" doesn't match the new format (lowercase letters/numbers/underscores, 3-20 chars). Review manually.`
      );
      skipped++;
      continue;
    }

    const usernameRef = db.collection("usernames").doc(rawUsername);
    const usernameSnap = await usernameRef.get();

    if (usernameSnap.exists) {
      const owner = usernameSnap.data().uid;
      if (owner !== uid) {
        console.warn(
          `Collision: "${rawUsername}" is already reserved by ${owner}, but ${uid} also has it set. Manual review needed.`
        );
      } else {
        alreadyReserved++;
      }
      continue;
    }

    await usernameRef.set({ uid });
    await userDoc.ref.set(
      {
        username: rawUsername,
        usernameEditsUsed: userDoc.data().usernameEditsUsed ?? 0,
      },
      { merge: true }
    );
    claimed++;
  }

  console.log(
    `Done. Reserved ${claimed} username(s), ${alreadyReserved} already reserved, ${skipped} skipped for review.`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
