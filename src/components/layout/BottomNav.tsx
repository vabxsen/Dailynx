import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

import { NAV_ITEMS } from "./nav";

/** Mobile-only bottom tab bar. */
function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-white/[0.06] bg-ink/90 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className="relative flex-1"
          >
            {({ isActive }) => (
              <span
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition ${
                  isActive ? "text-lime" : "text-zinc-500"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="bottomnav-active"
                    className="absolute top-0 h-0.5 w-8 rounded-full bg-lime"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className="h-5 w-5" />
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
