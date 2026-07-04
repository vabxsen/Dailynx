import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

import { NAV_ITEMS } from "./nav";
import InstallButton from "./InstallButton";
import LevelBadge from "../xp/LevelBadge";

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/[0.06] bg-white/[0.015] p-5 md:flex">
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <img
          src="/app-icon.png"
          alt="Dailynx"
          className="h-9 w-9 rounded-xl"
        />
        <h1 className="text-xl font-bold tracking-tight text-white">Dailynx</h1>
      </div>

      <div className="mb-4">
        <LevelBadge />
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className="relative block"
          >
            {({ isActive }) => (
              <span
                className={`relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "text-lime"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl border border-lime/20 bg-lime/10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <item.icon className="relative h-5 w-5" />
                <span className="relative">{item.label}</span>
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="pt-4">
        <InstallButton />
      </div>
    </aside>
  );
}

export default Sidebar;
