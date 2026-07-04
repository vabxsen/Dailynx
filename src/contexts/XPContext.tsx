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
import { levelFromXp, type LevelInfo } from "../utils/xp";
import {
  DEFAULT_HABIT_XP_REWARD,
  DEFAULT_TASK_XP_REWARD,
} from "../services/xpService";

interface XPContextType {
  level: LevelInfo;
  /** Fixed XP granted per habit check-in — not user-editable. */
  habitXpReward: number;
  /** Fixed XP granted per task completed — not user-editable. */
  taskXpReward: number;
  /** The level just reached, shown once by LevelUpOverlay, or null. */
  levelUpEvent: number | null;
  clearLevelUpEvent: () => void;
}

const XPContext = createContext<XPContextType | null>(null);

export function XPProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [totalXp, setTotalXp] = useState(0);
  const [levelUpEvent, setLevelUpEvent] = useState<number | null>(null);
  const [, setPrevLevel] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snap) => {
      const nextTotal = (snap.data()?.xpTotal as number) ?? 0;
      setTotalXp(nextTotal);

      const nextLevel = levelFromXp(nextTotal).level;
      setPrevLevel((prev) => {
        // Skip the very first snapshot so loading an existing level never
        // looks like a level-up.
        if (prev !== null && nextLevel > prev) {
          setLevelUpEvent(nextLevel);
        }
        return nextLevel;
      });
    });

    return unsubscribe;
  }, [user]);

  return (
    <XPContext.Provider
      value={{
        level: levelFromXp(totalXp),
        habitXpReward: DEFAULT_HABIT_XP_REWARD,
        taskXpReward: DEFAULT_TASK_XP_REWARD,
        levelUpEvent,
        clearLevelUpEvent: () => setLevelUpEvent(null),
      }}
    >
      {children}
    </XPContext.Provider>
  );
}

export const useXp = () => {
  const ctx = useContext(XPContext);

  if (!ctx) throw new Error("useXp must be used inside XPProvider");

  return ctx;
};
