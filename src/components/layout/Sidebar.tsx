const NAV_ITEMS = [
  { icon: "🏠", label: "Dashboard", active: true },
  { icon: "✅", label: "Habits" },
  { icon: "📊", label: "Analytics" },
  { icon: "📅", label: "Calendar" },
  { icon: "⚙️", label: "Settings" },
];

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-slate-900/50 p-6 md:flex">
      <div className="mb-10 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-lg">
          🚀
        </span>
        <h1 className="text-xl font-bold text-white">LifeOS</h1>
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
              item.active
                ? "bg-violet-600/20 text-violet-300"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
