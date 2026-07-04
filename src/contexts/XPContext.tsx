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
  saveXpRewards,
  type XpRewards,
} from "../services/xpService";

interface XPContextType {
  level: LevelInfo;
  habitXpReward: number;
  taskXpReward: number;
  setXpRewards: (patch: Partial<XpRewards>) => Promise<void>;
  /** The level just reached, shown once by LevelUpOverlay, or null. */
  levelUpEvent: number | null;
  clearLevelUpEvent: () => void;
}

const XPContext = createContext<XPContextType | null>(null);

export function XPProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [totalXp, setTotalXp] = useState(0);
  const [habitXpReward, setHabitXpReward] = useState(DEFAULT_HABIT_XP_REWARD);
  const [taskXpReward, setTaskXpReward] = useState(DEFAULT_TASK_XP_REWARD);
  const [levelUpEvent, setLevelUpEvent] = useState<number | null>(null);
  const [, setPrevLevel] = useState<number | null>(null);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snap) => {
      const data = snap.data();
      const nextTotal = (data?.xpTotal as number) ?? 0;

      setTotalXp(nextTotal);
      setHabitXpReward((data?.habitXpReward as number) ?? DEFAULT_HABIT_XP_REWARD);
      setTaskXpReward((data?.taskXpReward as number) ?? DEFAULT_TASK_XP_REWARD);

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

  const setXpRewards = async (patch: Partial<XpRewards>) => {
    if (!user) return;

    if (patch.habitXpReward !== undefined) setHabitXpReward(patch.habitXpReward);
    if (patch.taskXpReward !== undefined) setTaskXpReward(patch.taskXpReward);

    await saveXpRewards(user.uid, patch);
  };

  return (
    <XPContext.Provider
      value={{
        level: levelFromXp(totalXp),
        habitXpReward,
        taskXpReward,
        setXpRewards,
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
