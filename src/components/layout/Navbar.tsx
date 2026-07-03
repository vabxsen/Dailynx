import { useAuth } from "../../contexts/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  const name = user?.displayName?.split(" ")[0] ?? "there";

  return (
    <header className="h-20 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-8">
      <div>
        <h2 className="text-2xl font-bold text-white">
          Good Evening, {name} 👋
        </h2>

        <p className="text-zinc-400">Welcome back to LifeOS</p>
      </div>

      <div className="flex items-center gap-4">
        {user?.photoURL && (
          <img
            src={user.photoURL}
            alt={user.displayName ?? "Profile"}
            className="w-10 h-10 rounded-full border border-zinc-700"
          />
        )}

        <button
          onClick={() => logout()}
          className="text-sm text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-4 py-2 rounded-xl transition-all"
        >
          Log out
        </button>
      </div>
    </header>
  );
}

export default Navbar;
