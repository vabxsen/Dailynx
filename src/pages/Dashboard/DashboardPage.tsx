import { useEffect, useState } from "react";
import StatCard from "../../components/dashboard/StatCard";
import HabitCard from "../../components/habits/HabitCard";
import AddHabit from "../../components/habits/AddHabit";

import { useAuth } from "../../contexts/AuthContext";

import type { Habit } from "../../services/habitService";

import {
  getHabits,
  addHabit as addHabitToFirestore,
  setCompletion,
  deleteHabit as deleteHabitFromFirestore,
} from "../../services/habitService";

import { todayKey } from "../../utils/date";
import { currentStreak, bestStreak, monthlyCount } from "../../utils/streak";

function DashboardPage() {
  const { user } = useAuth();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [today, setToday] = useState(todayKey());

  useEffect(() => {
    if (!user) return;

    const loadHabits = async () => {
      const data = await getHabits(user.uid);
      setHabits(data);
    };

    loadHabits();
  }, [user]);

  // Roll the "today" key over when the calendar day changes while the app is
  // left open (past midnight) — this is what makes checkboxes auto-reset.
  useEffect(() => {
    const refresh = () => setToday(todayKey());

    const interval = setInterval(refresh, 60_000);
    window.addEventListener("focus", refresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  async function addHabit(title: string, time: string) {
    if (!user || !title.trim()) return;

    await addHabitToFirestore(user.uid, title, time);

    const data = await getHabits(user.uid);
    setHabits(data);
  }

  async function toggleHabit(index: number) {
    if (!user) return;

    const habit = habits[index];
    const done = !habit.completedDates.includes(today);

    // Optimistic local update — no full re-fetch.
    setHabits((prev) =>
      prev.map((h) =>
        h.id === habit.id
          ? {
              ...h,
              completedDates: done
                ? [...h.completedDates, today]
                : h.completedDates.filter((d) => d !== today),
            }
          : h
      )
    );

    await setCompletion(habit.id, today, done);
  }

  async function deleteHabit(index: number) {
    if (!user) return;

    const habit = habits[index];

    setHabits((prev) => prev.filter((h) => h.id !== habit.id));

    await deleteHabitFromFirestore(habit.id);
  }

  const isDoneToday = (habit: Habit) => habit.completedDates.includes(today);

  const completedCount = habits.filter(isDoneToday).length;

  const bestActiveStreak = habits.reduce(
    (max, h) => Math.max(max, currentStreak(h.completedDates, today)),
    0
  );

  const monthTotal = habits.reduce(
    (sum, h) => sum + monthlyCount(h.completedDates),
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>

        <p className="text-zinc-400">Track your daily productivity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Today's Progress"
          value={`${completedCount} / ${habits.length}`}
          icon="🎯"
        />

        <StatCard
          title="Best Active Streak"
          value={`${bestActiveStreak} Days`}
          icon="🔥"
        />

        <StatCard title="This Month" value={`${monthTotal}`} icon="🏆" />
      </div>

      <div className="space-y-4">
        <AddHabit onAdd={addHabit} />

        <h2 className="text-2xl font-bold text-white">Today's Habits</h2>

        <div className="space-y-3">
          {habits.map((habit, index) => (
            <HabitCard
              key={habit.id}
              title={habit.title}
              time={habit.time}
              completed={isDoneToday(habit)}
              currentStreak={currentStreak(habit.completedDates, today)}
              monthlyCount={monthlyCount(habit.completedDates)}
              bestStreak={bestStreak(habit.completedDates)}
              onToggle={() => toggleHabit(index)}
              onDelete={() => deleteHabit(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
