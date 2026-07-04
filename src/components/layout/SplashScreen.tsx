import { useEffect } from "react";
import { motion } from "framer-motion";

type Props = {
  onFinish: () => void;
};

/** Brand splash shown once on launch, then fades into the app. */
function SplashScreen({ onFinish }: Props) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1400);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      key="splash"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center gap-4"
      >
        <motion.img
          src="/app-icon.png"
          alt="Dailynx"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          className="h-24 w-24 rounded-3xl shadow-[0_0_60px_-10px_rgba(198,255,52,0.35)]"
        />
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: "easeOut" }}
          className="text-xl font-bold tracking-tight text-white"
        >
          Dailynx
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default SplashScreen;
