import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Check, X } from "lucide-react";

import type { SleepLog } from "../../services/sleepService";
import { formatDuration, sleepQuality, type SleepQuality } from "../../utils/sleep";

type Props = {
  log: SleepLog;
  goalMinutes: number;
  onEdit: (patch: { bedtime: string; wakeTime: string }) => void;
  onDelete: () => void;
};

const QUALITY_STYLE: Record<SleepQuality, { label: string; className: string }> = {
  great: { label: "Great", className: "bg-lime/10 text-lime" },
  okay: { label: "Okay", className: "bg-amber-400/10 text-amber-400" },
  poor: { label: "Poor", className: "bg-red-500/10 text-red-400" },
};

function dateLabel(dateKey: string): string {
  return new Date(`${dateKey}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function SleepLogRow({ log, goalMinutes, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [bedtime, setBedtime] = useState(log.bedtime);
  const [wakeTime, setWakeTime] = useState(log.wakeTime);

  const quality = QUALITY_STYLE[sleepQuality(log.durationMinutes, goalMinutes)];

  const save = () => {
    onEdit({ bedtime, wakeTime });
    setEditing(false);
  };

  const cancel = () => {
    setBedtime(log.bedtime);
    setWakeTime(log.wakeTime);
    setEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
    >
      {editing ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white outline-none focus:border-lime/50"
          />
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-white outline-none focus:border-lime/50"
          />
          <div className="flex gap-2">
            <button
              onClick={save}
              aria-label="Save"
              className="rounded-xl bg-lime p-2.5 text-ink transition hover:brightness-95"
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              onClick={cancel}
              aria-label="Cancel"
              className="rounded-xl border border-white/10 p-2.5 text-zinc-300 transition hover:bg-white/5"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-white">{dateLabel(log.date)}</span>
              <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${quality.className}`}>
                {quality.label}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
              <span>{log.bedtime} → {log.wakeTime}</span>
              <span className="text-zinc-600">·</span>
              <span>{formatDuration(log.durationMinutes)}</span>
            </div>
          </div>

          <div className="flex shrink-0 gap-1">
            <button
              onClick={() => setEditing(true)}
              aria-label="Edit sleep log"
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={onDelete}
              aria-label="Delete sleep log"
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default SleepLogRow;
