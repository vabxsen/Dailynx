import { motion } from "framer-motion";

import { useAuth } from "../../contexts/AuthContext";
import { useProfile } from "../../contexts/ProfileContext";

type Props = {
  onOpenProfile: () => void;
};

function greeting(): string {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function Navbar({ onOpenProfile }: Props) {
  const { user } = useAuth();
  const { displayName } = useProfile();

  const first = displayName.split(" ")[0];
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-white/[0.06] bg-ink/80 px-4 backdrop-blur md:h-20 md:px-8">
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime text-base text-ink md:hidden">
          🚀
        </span>

        <div>
          <h2 className="text-lg font-bold text-white md:text-2xl">
            {greeting()}, {first} 👋
          </h2>
          <p className="hidden text-sm text-zinc-400 sm:block">
            Let's build some streaks today.
          </p>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onOpenProfile}
        aria-label="Open profile"
        className="rounded-full ring-2 ring-transparent transition hover:ring-lime/50"
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            referrerPolicy="no-referrer"
            className="h-10 w-10 rounded-full border border-white/10 object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lime text-base font-bold text-ink">
            {initial}
          </span>
        )}
      </motion.button>
    </header>
  );
}

export default Navbar;
