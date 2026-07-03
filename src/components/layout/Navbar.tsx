import { useAuth } from "../../contexts/AuthContext";

function greeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function Navbar() {
  const { user, logout } = useAuth();

  const name = user?.displayName?.split(" ")[0] ?? "there";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 backdrop-blur md:h-20 md:px-8">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-base md:hidden">
          🚀
        </span>

        <div>
          <h2 className="text-lg font-bold text-white md:text-2xl">
            {greeting()}, {name} 👋
          </h2>
          <p className="hidden text-sm text-slate-400 sm:block">
            Let's build some streaks today.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {user?.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName ?? "Profile"}
            referrerPolicy="no-referrer"
            className="h-9 w-9 rounded-full border border-white/10"
          />
        )}

        <button
          onClick={() => logout()}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
        >
          Log out
        </button>
      </div>
    </header>
  );
}

export default Navbar;
