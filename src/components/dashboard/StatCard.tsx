type Accent = "violet" | "amber" | "emerald";

type StatCardProps = {
  title: string;
  value: string;
  icon: string;
  accent?: Accent;
};

const ACCENTS: Record<Accent, string> = {
  violet: "from-violet-500/25 to-violet-500/5 text-violet-300",
  amber: "from-amber-500/25 to-amber-500/5 text-amber-300",
  emerald: "from-emerald-500/25 to-emerald-500/5 text-emerald-300",
};

function StatCard({ title, value, icon, accent = "violet" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 transition hover:border-white/20">
      <div
        className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-xl ${ACCENTS[accent]}`}
      >
        {icon}
      </div>

      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-1 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

export default StatCard;
