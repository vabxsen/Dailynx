function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">🚀 LifeOS</h1>

      <nav className="space-y-4">
        <button className="block w-full text-left hover:text-blue-400">
          🏠 Dashboard
        </button>

        <button className="block w-full text-left hover:text-blue-400">
          ✅ Habits
        </button>

        <button className="block w-full text-left hover:text-blue-400">
          📊 Analytics
        </button>

        <button className="block w-full text-left hover:text-blue-400">
          📅 Calendar
        </button>

        <button className="block w-full text-left hover:text-blue-400">
          ⚙️ Settings
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;