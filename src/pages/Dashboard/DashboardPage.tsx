import { useState } from "react";
import StatCard from "../../components/dashboard/StatCard";
import HabitCard from "../../components/habits/HabitCard";
import AddHabit from "../../components/habits/AddHabit";

function DashboardPage() {
  const [habits, setHabits] = useState([
    { title: "Workout", completed: false },
    { title: "Python", completed: false },
    { title: "Read 30 Minutes", completed: false },
    { title: "Drink Water", completed: false },
    { title: "Sleep Before 11 PM", completed: false },
  ]);

  const toggleHabit = (index: number) => {
    const updated = [...habits];
    updated[index].completed = !updated[index].completed;
    setHabits(updated);
  };

  const addHabit = (title: string) => {
    setHabits([
      ...habits,
      {
        title,
        completed: false,
      },
    ]);
  };

  const deleteHabit = (index: number) => {
    setHabits(habits.filter((_, i) => i !== index));
  };

  const completedCount = habits.filter((habit) => habit.completed).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-zinc-400">
          Track your daily productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Current Streak"
          value="0 Days"
          icon="🔥"
        />

        <StatCard
          title="Today's Progress"
          value={`${completedCount} / ${habits.length}`}
          icon="🎯"
        />

        <StatCard
          title="Level"
          value="1"
          icon="🏆"
        />
      </div>

      <div className="space-y-4">
        <AddHabit onAdd={addHabit} />

        <h2 className="text-2xl font-bold text-white">
          Today's Habits
        </h2>

        <div className="space-y-3">
          {habits.map((habit, index) => (
            <HabitCard
              key={`${habit.title}-${index}`}
              title={habit.title}
              completed={habit.completed}
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