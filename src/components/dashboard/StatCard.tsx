import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  /** Optional highlight — draws the value + icon in the lime accent. */
  highlight?: boolean;
};

function StatCard({ title, value, icon: Icon, highlight }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-white/15"
    >
      <div
        className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${
          highlight ? "bg-lime/15 text-lime" : "bg-white/5 text-zinc-300"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-sm text-zinc-400">{title}</p>
      <p
        className={`mt-1 text-2xl font-bold ${
          highlight ? "text-lime" : "text-white"
        }`}
      >
        {value}
      </p>
    </motion.div>
  );
}

export default StatCard;
