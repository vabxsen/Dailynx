import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface Window {
    __pwaPrompt: BeforeInstallPromptEvent | null;
  }
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

/**
 * Reads the install prompt captured early by the inline script in index.html
 * (see window.__pwaPrompt), so we never miss a beforeinstallprompt that fired
 * before React mounted.
 */
export function usePwaInstall() {
  const [canInstall, setCanInstall] = useState<boolean>(
    typeof window !== "undefined" && !!window.__pwaPrompt
  );
  const [installed, setInstalled] = useState(isStandalone());

  const isIOS =
    typeof navigator !== "undefined" &&
    /iphone|ipad|ipod/i.test(navigator.userAgent);

  useEffect(() => {
    const onInstallable = () => setCanInstall(!!window.__pwaPrompt);
    const onInstalled = () => {
      setInstalled(true);
      setCanInstall(false);
    };

    window.addEventListener("pwa:installable", onInstallable);
    window.addEventListener("pwa:installed", onInstalled);

    return () => {
      window.removeEventListener("pwa:installable", onInstallable);
      window.removeEventListener("pwa:installed", onInstalled);
    };
  }, []);

  const promptInstall = async () => {
    const deferred = window.__pwaPrompt;
    if (!deferred) return;

    await deferred.prompt();
    await deferred.userChoice;

    window.__pwaPrompt = null;
    setCanInstall(false);
  };

  return {
    canInstall,
    installed,
    isIOS,
    promptInstall,
  };
}
