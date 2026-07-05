import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./AuthContext";
import { useXp } from "./XPContext";
import type { Habit } from "../services/habitService";
import {
  getHabits,
  addHabit as addHabitToFirestore,
  setCompletion,
  updateHabit as updateHabitInFirestore,
  deleteHabit as deleteHabitFromFirestore,
} from "../services/habitService";
import { awardHabitXp } from "../services/xpService";
import { evaluateAndUnlockAchievements } from "../services/achievementService";
import { todayKey } from "../utils/date";

interface HabitsContextType {
  habits: Habit[];
  today: string;
  loading: boolean;
  addHabit: (title: string, time: string) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
  editHabit: (id: string, patch: { title: string; time: string }) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
}

const HabitsContext = createContext<HabitsContextType | null>(null);

export function HabitsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { habitXpReward } = useXp();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [today, setToday] = useState(todayKey());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;

    const data = await getHabits(user.uid);
    setHabits(data);
    setLoading(false);
    await evaluateAndUnlockAchievements(user.uid, data);
  }, [user]);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!user) return;

      const data = await getHabits(user.uid);
      if (active) {
        setHabits(data);
        setLoading(false);
      }
      // Catches achievements already earned by history synced from another
      // device, even if this tab never calls refresh()/toggleHabit().
      await evaluateAndUnlockAchievements(user.uid, data);
    })();

    return () => {
      active = false;
    };
  }, [user]);

  // Roll "today" over at local midnight even if the app is left open.
  useEffect(() => {
    const tick = () => setToday(todayKey());

    const interval = setInterval(tick, 60_000);
    window.addEventListener("focus", tick);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", tick);
    };
  }, []);

  const addHabit = async (title: string, time: string) => {
    if (!user || !title.trim()) return;

    await addHabitToFirestore(user.uid, title.trim(), time);
    await refresh();
  };

  const toggleHabit = async (id: string) => {
    const habit = habits.find((h) => h.id === id);
    if (!habit || !user) return;

    const done = !habit.completedDates.includes(today);

    const updatedHabits = habits.map((h) =>
      h.id === id
        ? {
            ...h,
            completedDates: done
              ? [...h.completedDates, today]
              : h.completedDates.filter((d) => d !== today),
          }
        : h
    );

    setHabits(updatedHabits);
    await setCompletion(id, today, done);

    // Unchecking never touches XP or achievements — they're only ever
    // granted once, permanently, the first time a habit is marked done.
    if (done) {
      await awardHabitXp(user.uid, id, today, habitXpReward);
      await evaluateAndUnlockAchievements(user.uid, updatedHabits);
    }
  };

  const editHabit = async (
    id: string,
    patch: { title: string; time: string }
  ) => {
    setHabits((prev) =>
      prev
        .map((h) => (h.id === id ? { ...h, ...patch } : h))
        .sort((a, b) => (a.time || "~").localeCompare(b.time || "~"))
    );

    await updateHabitInFirestore(id, patch);
  };

  const removeHabit = async (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    await deleteHabitFromFirestore(id);
  };

  return (
    <HabitsContext.Provider
      value={{
        habits,
        today,
        loading,
        addHabit,
        toggleHabit,
        editHabit,
        removeHabit,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
}

export const useHabits = () => {
  const ctx = useContext(HabitsContext);

  if (!ctx) throw new Error("useHabits must be used inside HabitsProvider");

  return ctx;
};
