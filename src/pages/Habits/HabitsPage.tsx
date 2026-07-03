import { AnimatePresence } from "framer-motion";

import PageHeader from "../../components/layout/PageHeader";
import AddHabit from "../../components/habits/AddHabit";
import HabitManageRow from "../../components/habits/HabitManageRow";
import { useHabits } from "../../contexts/HabitsContext";
import { currentStreak, bestStreak, monthlyCount } from "../../utils/streak";

function HabitsPage() {
  const { habits, today, addHabit, editHabit, removeHabit } = useHabits();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Habits"
        subtitle="Create, edit, and organise your daily habits."
      />

      <AddHabit onAdd={addHabit} />

      {habits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
          <div className="mb-3 text-4xl">📋</div>
          <p className="font-medium text-white">No habits yet</p>
          <p className="mt-1 text-sm text-zinc-400">
            Use the box above to add your first habit.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {habits.map((habit) => (
              <HabitManageRow
                key={habit.id}
                habit={habit}
                currentStreak={currentStreak(habit.completedDates, today)}
                bestStreak={bestStreak(habit.completedDates)}
                monthlyCount={monthlyCount(habit.completedDates)}
                onEdit={(patch) => editHabit(habit.id, patch)}
                onDelete={() => removeHabit(habit.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default HabitsPage;
