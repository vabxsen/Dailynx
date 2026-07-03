import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Check, Share, X } from "lucide-react";

import { usePwaInstall } from "../../hooks/usePwaInstall";

type Props = {
  /** "full" shows a labelled button; "compact" shows an icon-only pill. */
  variant?: "full" | "compact";
};

function InstallButton({ variant = "full" }: Props) {
  const { canInstall, installed, isIOS, promptInstall } = usePwaInstall();
  const [showHelp, setShowHelp] = useState(false);

  if (installed) {
    if (variant === "compact") return null;

    return (
      <div className="flex items-center gap-2 rounded-xl border border-lime/30 bg-lime/10 px-4 py-2.5 text-sm font-medium text-lime">
        <Check className="h-4 w-4" />
        App installed
      </div>
    );
  }

  const handleClick = () => {
    if (canInstall) {
      promptInstall();
    } else {
      // iOS Safari (and browsers that haven't fired the prompt yet) → show help.
      setShowHelp(true);
    }
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={handleClick}
        className={
          variant === "compact"
            ? "flex items-center gap-2 rounded-xl bg-lime px-3 py-2 text-sm font-semibold text-ink transition hover:brightness-95"
            : "flex w-full items-center justify-center gap-2 rounded-xl bg-lime px-4 py-2.5 text-sm font-semibold text-ink transition hover:brightness-95"
        }
      >
        <Download className="h-4 w-4" />
        {variant === "compact" ? "Install" : "Install app"}
      </motion.button>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setShowHelp(false)}
            />

            <motion.div
              className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 text-center shadow-2xl"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            >
              <button
                onClick={() => setShowHelp(false)}
                aria-label="Close"
                className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-lime/15 text-lime">
                <Download className="h-6 w-6" />
              </div>

              <h3 className="text-lg font-semibold text-white">Install LifeOS</h3>

              {isIOS ? (
                <p className="mt-2 flex flex-wrap items-center justify-center gap-1 text-sm text-zinc-400">
                  Tap the <Share className="inline h-4 w-4" /> Share button in
                  Safari, then choose{" "}
                  <span className="text-white">“Add to Home Screen”.</span>
                </p>
              ) : (
                <p className="mt-2 text-sm text-zinc-400">
                  Open this site in Chrome or Edge and use the install icon in
                  the address bar, or the browser menu →{" "}
                  <span className="text-white">“Install app”.</span>
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default InstallButton;
