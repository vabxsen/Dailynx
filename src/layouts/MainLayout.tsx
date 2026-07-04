import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Sidebar from "../components/layout/Sidebar";
import BottomNav from "../components/layout/BottomNav";
import Navbar from "../components/layout/Navbar";
import ProfileModal from "../components/profile/ProfileModal";
import LevelUpOverlay from "../components/xp/LevelUpOverlay";

function MainLayout() {
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-ink text-white">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar onOpenProfile={() => setProfileOpen(true)} />

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <BottomNav />

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
      <LevelUpOverlay />
    </div>
  );
}

export default MainLayout;
