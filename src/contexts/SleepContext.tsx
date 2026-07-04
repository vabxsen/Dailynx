import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./AuthContext";
import type { SleepLog } from "../services/sleepService";
import {
  getSleepLogs,
  saveSleepLog,
  deleteSleepLog as deleteSleepLogFromFirestore,
  getSleepGoalMinutes,
  saveSleepGoalMinutes,
  DEFAULT_SLEEP_GOAL_MINUTES,
} from "../services/sleepService";
import { computeDurationMinutes } from "../utils/sleep";
import { todayKey } from "../utils/date";

interface SleepContextType {
  logs: SleepLog[];
  loading: boolean;
  goalMinutes: number;
  setGoalMinutes: (minutes: number) => Promise<void>;
  /** Creates or updates the log for `date` (defaults to today). */
  logSleep: (bedtime: string, wakeTime: string, date?: string) => Promise<void>;
  removeSleepLog: (id: string) => Promise<void>;
}

const SleepContext = createContext<SleepContextType | null>(null);

export function SleepProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [goalMinutes, setGoalMinutesState] = useState(DEFAULT_SLEEP_GOAL_MINUTES);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) return;

    const data = await getSleepLogs(user.uid);
    setLogs(data);
  }, [user]);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!user) return;

      const [data, goal] = await Promise.all([
        getSleepLogs(user.uid),
        getSleepGoalMinutes(user.uid),
      ]);

      if (active) {
        setLogs(data);
        setGoalMinutesState(goal);
        setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [user]);

  const logSleep = async (
    bedtime: string,
    wakeTime: string,
    date: string = todayKey()
  ) => {
    if (!user) return;

    const durationMinutes = computeDurationMinutes(bedtime, wakeTime);
    const existing = logs.find((l) => l.date === date);

    await saveSleepLog(
      user.uid,
      existing?.id ?? null,
      date,
      bedtime,
      wakeTime,
      durationMinutes
    );
    await refresh();
  };

  const removeSleepLog = async (id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
    await deleteSleepLogFromFirestore(id);
  };

  const setGoalMinutes = async (minutes: number) => {
    if (!user) return;

    setGoalMinutesState(minutes);
    await saveSleepGoalMinutes(user.uid, minutes);
  };

  return (
    <SleepContext.Provider
      value={{ logs, loading, goalMinutes, setGoalMinutes, logSleep, removeSleepLog }}
    >
      {children}
    </SleepContext.Provider>
  );
}

export const useSleep = () => {
  const ctx = useContext(SleepContext);

  if (!ctx) throw new Error("useSleep must be used inside SleepProvider");

  return ctx;
};
