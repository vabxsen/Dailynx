import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { doc, onSnapshot } from "firebase/firestore";

import { useAuth } from "./AuthContext";
import { db } from "../firebase/firebase";
import type { UnlockedAchievementsMap } from "../services/achievementService";

interface AchievementsContextType {
  unlocked: UnlockedAchievementsMap;
  /**
   * IDs unlocked since the last dismiss. Shown together as one combined
   * celebration (not one popup per ID) — a burst of retroactive unlocks
   * (e.g. several thresholds crossed at once by existing history) would
   * otherwise queue a full-screen overlay every few seconds as the user
   * tries to navigate elsewhere.
   */
  newlyUnlockedIds: string[];
  dismissAll: () => void;
}

const AchievementsContext = createContext<AchievementsContextType | null>(null);

export function AchievementsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [unlocked, setUnlocked] = useState<UnlockedAchievementsMap>({});
  const [newlyUnlockedIds, setNewlyUnlockedIds] = useState<string[]>([]);
  const [, setSeenIds] = useState<Set<string> | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snap) => {
      const next: UnlockedAchievementsMap = snap.data()?.unlockedAchievements ?? {};
      setUnlocked(next);

      const nextIds = new Set(Object.keys(next));
      setSeenIds((prevSeen) => {
        // Skip the very first snapshot so loading existing unlocks never
        // looks like a fresh celebration.
        if (prevSeen !== null) {
          const added = [...nextIds].filter((id) => !prevSeen.has(id));
          if (added.length > 0) {
            setNewlyUnlockedIds((prev) => [...prev, ...added]);
          }
        }
        return nextIds;
      });
    });

    return unsubscribe;
  }, [user]);

  const dismissAll = () => setNewlyUnlockedIds([]);

  return (
    <AchievementsContext.Provider value={{ unlocked, newlyUnlockedIds, dismissAll }}>
      {children}
    </AchievementsContext.Provider>
  );
}

export const useAchievements = () => {
  const ctx = useContext(AchievementsContext);

  if (!ctx) throw new Error("useAchievements must be used inside AchievementsProvider");

  return ctx;
};
