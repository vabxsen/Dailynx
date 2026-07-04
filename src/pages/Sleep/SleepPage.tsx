import { useState } from "react";
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
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Pencil, Target } from "lucide-react";

import PageHeader from "../../components/layout/PageHeader";
import SleepLogForm from "../../components/sleep/SleepLogForm";
import SleepLogRow from "../../components/sleep/SleepLogRow";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { useSleep } from "../../contexts/SleepContext";
import type { SleepLog } from "../../services/sleepService";
import { lastNDays, todayKey } from "../../utils/date";
import { bestStreak } from "../../utils/streak";
import {
  averageMinutes,
  formatDuration,
  goalMetRate,
  sleepQuality,
  type SleepQuality,
} from "../../utils/sleep";

const LIME = "#c6ff34";

const QUALITY_LABEL: Record<SleepQuality, string> = {
  great: "Great",
  okay: "Okay",
  poor: "Poor",
};

const QUALITY_TEXT_CLASS: Record<SleepQuality, string> = {
  great: "text-lime",
  okay: "text-amber-400",
  poor: "text-red-400",
};

function SleepPage() {
  const { logs, loading, goalMinutes, setGoalMinutes, logSleep, removeSleepLog } =
    useSleep();

  const [deleteTarget, setDeleteTarget] = useState<SleepLog | null>(null);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(goalMinutes / 60));

  const today = todayKey();
  const byDate = new Map(logs.map((l) => [l.date, l]));
  const todayLog = byDate.get(today);

  const week = lastNDays(7, today);
  const month = lastNDays(30, today);

  const weekChart = week.map((key) => ({
    label: new Date(`${key}T00:00:00`).toLocaleDateString(undefined, { weekday: "short" }),
    hours: byDate.get(key) ? Math.round((byDate.get(key)!.durationMinutes / 60) * 10) / 10 : 0,
  }));

  const monthChart = month.map((key) => ({
    label: key.slice(8),
    hours: byDate.get(key) ? Math.round((byDate.get(key)!.durationMinutes / 60) * 10) / 10 : 0,
  }));

  const metDates = logs.filter((l) => l.durationMinutes >= goalMinutes).map((l) => l.date);
  const weekDurations = week.map((key) => byDate.get(key)?.durationMinutes).filter((n): n is number => n != null);
  const monthDurations = month.map((key) => byDate.get(key)?.durationMinutes).filter((n): n is number => n != null);

  const recent = [...logs].reverse().slice(0, 14);

  const saveGoal = () => {
    const hours = Math.max(1, Math.min(16, Number(goalInput) || 8));
    setGoalMinutes(Math.round(hours * 60));
    setEditingGoal(false);
  };

  const tooltipStyle = {
    background: "#0a0a0a",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#fff",
  };

  if (loading) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Sleep" subtitle="Track your rest and recovery." />

      {/* Hero */}
      <div className="overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-br from-white/[0.05] to-transparent p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-zinc-400">Last night</p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-4xl font-bold text-white">
                {todayLog ? formatDuration(todayLog.durationMinutes) : "—"}
              </span>
              {todayLog && (
                <span className={`text-sm font-medium ${QUALITY_TEXT_CLASS[sleepQuality(todayLog.durationMinutes, goalMinutes)]}`}>
                  {QUALITY_LABEL[sleepQuality(todayLog.durationMinutes, goalMinutes)]}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Goal: {formatDuration(goalMinutes)}
            </p>
          </div>

          <div className="text-right">
            {editingGoal ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={16}
                  step={0.5}
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveGoal()}
                  autoFocus
                  className="w-20 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-white outline-none focus:border-lime/50"
                />
                <button
                  onClick={saveGoal}
                  className="rounded-xl bg-lime px-3 py-2 text-sm font-semibold text-ink transition hover:brightness-95"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setGoalInput(String(goalMinutes / 60));
                  setEditingGoal(true);
                }}
                className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/5 hover:text-white"
              >
                <Target className="h-4 w-4" />
                Edit goal
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full bg-lime"
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(((todayLog?.durationMinutes ?? 0) / goalMinutes) * 100, 100)}%`,
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Log tonight's sleep */}
      <SleepLogForm
        key={todayLog?.id ?? "new"}
        bedtime={todayLog?.bedtime ?? "23:00"}
        wakeTime={todayLog?.wakeTime ?? "07:00"}
        editing={!!todayLog}
        onSave={(bedtime, wakeTime) => logSleep(bedtime, wakeTime)}
      />

      {logs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
          <div className="mb-3 text-3xl">🌙</div>
          <p className="font-medium text-white">No sleep logged yet</p>
          <p className="mt-1 text-sm text-zinc-400">
            Log last night's bedtime and wake time above to get started.
          </p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MiniStat label="7-day average" value={formatDuration(averageMinutes(weekDurations))} />
            <MiniStat label="30-day average" value={formatDuration(averageMinutes(monthDurations))} />
            <MiniStat label="Goal met rate" value={`${goalMetRate(monthDurations, goalMinutes)}%`} highlight />
            <MiniStat label="Best streak" value={`${bestStreak(metDates)}d`} />
          </div>

          <Card title="Last 7 nights">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekChart}>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="label" tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} formatter={(v) => [`${v}h`, "Sleep"]} />
                  <Bar dataKey="hours" fill={LIME} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Last 30 nights">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthChart}>
                  <defs>
                    <linearGradient id="sleepFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={LIME} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={LIME} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="label" tick={{ fill: "#a1a1aa", fontSize: 11 }} axisLine={false} tickLine={false} interval={4} />
                  <YAxis allowDecimals={false} tick={{ fill: "#a1a1aa", fontSize: 12 }} axisLine={false} tickLine={false} width={28} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}h`, "Sleep"]} />
                  <Area type="monotone" dataKey="hours" stroke={LIME} strokeWidth={2} fill="url(#sleepFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Recent nights */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-zinc-400" />
              <h2 className="text-lg font-bold text-white">Recent nights</h2>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {recent.map((log) => (
                  <SleepLogRow
                    key={log.id}
                    log={log}
                    goalMinutes={goalMinutes}
                    onEdit={(patch) => logSleep(patch.bedtime, patch.wakeTime, log.date)}
                    onDelete={() => setDeleteTarget(log)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
        </>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete this sleep log?"
        message={
          deleteTarget
            ? `Remove the log for ${new Date(`${deleteTarget.date}T00:00:00`).toLocaleDateString(undefined, { month: "long", day: "numeric" })}? This can't be undone.`
            : ""
        }
        confirmLabel="Delete"
        danger
        onConfirm={() => deleteTarget && removeSleepLog(deleteTarget.id)}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}

function MiniStat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
      <p className="text-xs text-zinc-400">{label}</p>
      <p className={`mt-1 text-xl font-bold ${highlight ? "text-lime" : "text-white"}`}>{value}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h3 className="mb-4 font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}

export default SleepPage;
