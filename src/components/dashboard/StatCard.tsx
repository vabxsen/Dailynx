type StatCardProps = {
  title: string;
  value: string;
  icon: string;
};

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-blue-500 transition-all">
      <div className="text-3xl">{icon}</div>

      <h3 className="text-zinc-400 mt-4">
        {title}
      </h3>

      <p className="text-3xl font-bold text-white mt-2">
        {value}
      </p>
    </div>
  );
}

export default StatCard;