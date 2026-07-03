import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import PageHeader from "../../components/layout/PageHeader";
import { useHabits } from "../../contexts/HabitsContext";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function CalendarPage() {
  const { habits, today } = useHabits();

  const base = new Date(`${today}T00:00:00`);
  const [view, setView] = useState({
    year: base.getFullYear(),
    month: base.getMonth(), // 0-based
  });

  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const firstWeekday = new Date(view.year, view.month, 1).getDay();

  const completionsOn = (key: string) =>
    habits.filter((h) => h.completedDates.includes(key)).length;

  const step = (delta: number) => {
    const m = view.month + delta;
    const year = view.year + Math.floor(m / 12);
    const month = ((m % 12) + 12) % 12;
    setView({ year, month });
  };

  const intensityClass = (count: number) => {
    if (habits.length === 0 || count === 0) return "bg-white/[0.03] text-zinc-500";
    const ratio = count / habits.length;
    if (ratio >= 1) return "bg-lime text-ink";
    if (ratio >= 0.66) return "bg-lime/70 text-ink";
    if (ratio >= 0.33) return "bg-lime/40 text-ink";
    return "bg-lime/20 text-white";
  };

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        subtitle="Every day's completion at a glance."
      />

      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            {MONTHS[view.month]} {view.year}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => step(-1)}
              aria-label="Previous month"
              className="rounded-lg border border-white/10 p-2 text-zinc-300 transition hover:bg-white/5"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => step(1)}
              aria-label="Next month"
              className="rounded-lg border border-white/10 p-2 text-zinc-300 transition hover:bg-white/5"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-xs text-zinc-500">
          {WEEKDAYS.map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((day, i) => {
            if (day === null) return <div key={`e${i}`} />;

            const key = `${view.year}-${pad(view.month + 1)}-${pad(day)}`;
            const count = completionsOn(key);
            const isToday = key === today;

            return (
              <div
                key={key}
                title={`${count} completed`}
                className={`flex aspect-square items-center justify-center rounded-lg text-sm font-medium transition ${intensityClass(
                  count
                )} ${isToday ? "ring-2 ring-lime ring-offset-2 ring-offset-ink" : ""}`}
              >
                {day}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2 text-xs text-zinc-500">
          <span>Less</span>
          <span className="h-3.5 w-3.5 rounded bg-white/[0.03]" />
          <span className="h-3.5 w-3.5 rounded bg-lime/20" />
          <span className="h-3.5 w-3.5 rounded bg-lime/40" />
          <span className="h-3.5 w-3.5 rounded bg-lime/70" />
          <span className="h-3.5 w-3.5 rounded bg-lime" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
