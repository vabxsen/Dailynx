import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Flame,
  CalendarCheck,
  ListTodo,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

import ProgressRing from "../../components/dashboard/ProgressRing";
import TodoList from "../../components/dashboard/TodoList";
import HabitCard from "../../components/habits/HabitCard";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useHabits } from "../../contexts/HabitsContext";
import { useTodos } from "../../hooks/useTodos";
import type { Habit } from "../../services/habitService";
import { currentStreak, monthlyCount } from "../../utils/streak";

function DashboardPage() {
  const { habits, today, toggleHabit } = useHabits();
  const { todos, addTodo, toggleTodo, removeTodo } = useTodos();

  // Habit pending an "uncheck" confirmation.
  const [uncheckTarget, setUncheckTarget] = useState<Habit | null>(null);

  const isDoneToday = (dates: string[]) => dates.includes(today);

  // Checking is instant; unchecking asks for confirmation first.
  const handleToggle = (habit: Habit) => {
    if (isDoneToday(habit.completedDates)) {
      setUncheckTarget(habit);
    } else {
      toggleHabit(habit.id);
    }
  };

  const completed = habits.filter((h) => isDoneToday(h.completedDates)).length;
  const progress = habits.length
    ? Math.round((completed / habits.length) * 100)
    : 0;

  const bestActiveStreak = habits.reduce(
    (max, h) => Math.max(max, currentStreak(h.completedDates, today)),
    0
  );
  const monthTotal = habits.reduce(
    (sum, h) => sum + monthlyCount(h.completedDates),
    0
  );
  const todosDone = todos.filter((t) => t.done).length;

  const dateLabel = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.05] to-transparent p-6 md:p-8"
      >
        <p className="text-sm font-medium text-zinc-400">{dateLabel}</p>

        <div className="mt-6 flex flex-col items-center gap-8 sm:flex-row sm:gap-10">
          <ProgressRing progress={progress}>
            <span className="text-3xl font-bold text-white">{progress}%</span>
            <span className="mt-0.5 text-xs text-zinc-400">
              {completed}/{habits.length} habits
            </span>
          </ProgressRing>

          <div className="grid w-full flex-1 grid-cols-3 gap-3">
            <HeroStat
              icon={Flame}
              label="Streak"
              value={`${bestActiveStreak}d`}
              highlight
            />
            <HeroStat
              icon={CalendarCheck}
              label="This month"
              value={`${monthTotal}`}
            />
            <HeroStat
              icon={ListTodo}
              label="Tasks"
              value={`${todosDone}/${todos.length}`}
            />
          </div>
        </div>
      </motion.section>

      {/* Habits + To-dos */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Today's schedule</h2>
            <Link
              to="/habits"
              className="text-sm text-zinc-400 transition hover:text-lime"
            >
              Manage
            </Link>
          </div>

          {habits.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
              <div className="mb-3 text-3xl">🌱</div>
              <p className="font-medium text-white">No habits yet</p>
              <Link
                to="/habits"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-lime px-4 py-2.5 text-sm font-semibold text-ink transition hover:brightness-95"
              >
                Add a habit <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <motion.div layout className="space-y-3">
              <AnimatePresence initial={false}>
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    title={habit.title}
                    time={habit.time}
                    completed={isDoneToday(habit.completedDates)}
                    currentStreak={currentStreak(habit.completedDates, today)}
                    monthlyCount={monthlyCount(habit.completedDates)}
                    onToggle={() => handleToggle(habit)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        <section>
          <TodoList
            todos={todos}
            onAdd={addTodo}
            onToggle={toggleTodo}
            onDelete={removeTodo}
          />
        </section>
      </div>

      <ConfirmModal
        open={!!uncheckTarget}
        title="Uncheck this habit?"
        message={
          uncheckTarget
            ? `Do you really want to uncheck "${uncheckTarget.title}"? This removes today's completion and may break your streak.`
            : ""
        }
        confirmLabel="Uncheck"
        onConfirm={() => uncheckTarget && toggleHabit(uncheckTarget.id)}
        onClose={() => setUncheckTarget(null)}
      />
    </div>
  );
}

function HeroStat({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 text-center sm:p-4">
      <Icon
        className={`mx-auto h-5 w-5 ${
          highlight ? "text-lime" : "text-zinc-400"
        }`}
      />
      <p
        className={`mt-2 text-lg font-bold ${
          highlight ? "text-lime" : "text-white"
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-zinc-500">{label}</p>
    </div>
  );
}

export default DashboardPage;
