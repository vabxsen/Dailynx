import { useState } from "react";
import { motion } from "framer-motion";
import { Moon } from "lucide-react";

import { computeDurationMinutes, formatDuration } from "../../utils/sleep";

type Props = {
  bedtime: string;
  wakeTime: string;
  editing: boolean;
  onSave: (bedtime: string, wakeTime: string) => void;
};

/** Logs (or edits) the current wake date's sleep — bedtime, wake time, and a live duration preview. */
function SleepLogForm({ bedtime: initialBedtime, wakeTime: initialWakeTime, editing, onSave }: Props) {
  const [bedtime, setBedtime] = useState(initialBedtime);
  const [wakeTime, setWakeTime] = useState(initialWakeTime);

  const duration = formatDuration(computeDurationMinutes(bedtime, wakeTime));

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3 sm:flex-row sm:items-center">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="mb-1 block px-1 text-xs text-zinc-500">Bedtime</span>
          <input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition focus:border-lime/50"
          />
        </label>

        <label className="flex-1">
          <span className="mb-1 block px-1 text-xs text-zinc-500">Wake time</span>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition focus:border-lime/50"
          />
        </label>
      </div>

      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
        <span className="flex items-center gap-1.5 text-sm text-zinc-400">
          <Moon className="h-3.5 w-3.5" />
          {duration}
        </span>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onSave(bedtime, wakeTime)}
          className="flex items-center gap-2 whitespace-nowrap rounded-xl bg-lime px-5 py-3 font-semibold text-ink transition hover:brightness-95"
        >
          {editing ? "Update" : "Log sleep"}
        </motion.button>
      </div>
    </div>
  );
}

export default SleepLogForm;
