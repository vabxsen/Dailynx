import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Target, Flame, Trophy, ArrowRight } from "lucide-react";

import StatCard from "../../components/dashboard/StatCard";
import HabitCard from "../../components/habits/HabitCard";
import { useHabits } from "../../contexts/HabitsContext";
import { currentStreak, monthlyCount } from "../../utils/streak";

function DashboardPage() {
  const { habits, today, toggleHabit } = useHabits();

  const isDoneToday = (dates: string[]) => dates.includes(today);

  const completedCount = habits.filter((h) =>
    isDoneToday(h.completedDates)
  ).length;
  const progress = habits.length
    ? Math.round((completedCount / habits.length) * 100)
    : 0;

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Today's progress"
          value={`${completedCount} / ${habits.length}`}
          icon={Target}
        />
        <StatCard
          title="Best active streak"
          value={`${bestActiveStreak} ${bestActiveStreak === 1 ? "day" : "days"}`}
          icon={Flame}
          highlight
        />
        <StatCard title="This month" value={`${monthTotal}`} icon={Trophy} />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Today's schedule</h2>
          <span className="text-sm text-zinc-400">{progress}% done</span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full rounded-full bg-lime"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>

        {habits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
            <div className="mb-3 text-4xl">🌱</div>
            <p className="font-medium text-white">No habits yet</p>
            <p className="mt-1 text-sm text-zinc-400">
              Head to the Habits page to create your first one.
            </p>
            <Link
              to="/habits"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-lime px-4 py-2.5 text-sm font-semibold text-ink transition hover:brightness-95"
            >
              Add a habit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <motion.div layout className="space-y-3">
            <AnimatePresence>
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  title={habit.title}
                  time={habit.time}
                  completed={isDoneToday(habit.completedDates)}
                  currentStreak={currentStreak(habit.completedDates, today)}
                  monthlyCount={monthlyCount(habit.completedDates)}
                  onToggle={() => toggleHabit(habit.id)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
