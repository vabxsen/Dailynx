import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Flame } from "lucide-react";

import PageHeader from "../../components/layout/PageHeader";
import { useHabits } from "../../contexts/HabitsContext";
import { useXp } from "../../contexts/XPContext";
import { lastNDays } from "../../utils/date";
import { currentStreak, bestStreak } from "../../utils/streak";

const LIME = "#c6ff34";

function AnalyticsPage() {
  const { habits, today } = useHabits();
  const { level } = useXp();

  const completionsOn = (key: string) =>
    habits.filter((h) => h.completedDates.includes(key)).length;

  const weekdayLabel = (key: string) =>
    new Date(`${key}T00:00:00`).toLocaleDateString(undefined, {
      weekday: "short",
    });

  const week = lastNDays(7, today).map((key) => ({
    label: weekdayLabel(key),
    done: completionsOn(key),
  }));

  const month = lastNDays(30, today).map((key) => ({
    label: key.slice(8), // day-of-month
    done: completionsOn(key),
  }));

  const totalCompletions = habits.reduce(
    (sum, h) => sum + h.completedDates.length,
    0
  );
  const weekDone = week.reduce((s, d) => s + d.done, 0);
  const weekRate = habits.length
    ? Math.round((weekDone / (habits.length * 7)) * 100)
    : 0;
  const longestStreak = habits.reduce(
    (max, h) => Math.max(max, bestStreak(h.completedDates)),
    0
  );

  const leaderboard = [...habits]
    .map((h) => ({ title: h.title, streak: currentStreak(h.completedDates, today) }))
    .sort((a, b) => b.streak - a.streak)
    .slice(0, 5);

  const tooltipStyle = {
    background: "#0a0a0a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#fff",
  };

  if (habits.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" subtitle="Your progress over time." />
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-zinc-400">
          Add some habits and check them off to see your analytics here.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="Your progress over time." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <MiniStat label="Total check-ins" value={`${totalCompletions}`} />
        <MiniStat label="Active habits" value={`${habits.length}`} />
        <MiniStat label="7-day rate" value={`${weekRate}%`} highlight />
        <MiniStat label="Longest streak" value={`${longestStreak}d`} />
        <MiniStat label="Level" value={`${level.level}`} highlight />
        <MiniStat label="Total XP" value={`${level.totalXp}`} />
      </div>

      <Card title="Last 7 days">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={week}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={24}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar dataKey="done" fill={LIME} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Last 30 days">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={month}>
              <defs>
                <linearGradient id="limeFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={LIME} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={LIME} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#a1a1aa", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={4}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#a1a1aa", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={24}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="done"
                stroke={LIME}
                strokeWidth={2}
                fill="url(#limeFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Top streaks">
        <div className="space-y-2">
          {leaderboard.map((h, i) => (
            <div
              key={h.title + i}
              className="flex items-center justify-between rounded-xl bg-white/[0.02] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-zinc-500">#{i + 1}</span>
                <span className="font-medium text-white">{h.title}</span>
              </div>
              <span className="flex items-center gap-1 text-sm text-lime">
                <Flame className="h-4 w-4" />
                {h.streak} day{h.streak === 1 ? "" : "s"}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function MiniStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-xs text-zinc-400">{label}</p>
      <p
        className={`mt-1 text-xl font-bold ${
          highlight ? "text-lime" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h3 className="mb-4 font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}

export default AnalyticsPage;
