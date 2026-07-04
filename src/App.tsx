import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import AppRouter from "./routers/AppRouter";
import SplashScreen from "./components/layout/SplashScreen";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>
      <AppRouter />
    </>
  );
}