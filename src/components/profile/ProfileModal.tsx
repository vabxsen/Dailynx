import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, X } from "lucide-react";

import { useProfile } from "../../contexts/ProfileContext";
import { useAuth } from "../../contexts/AuthContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

function ProfileModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && <ProfileDialog onClose={onClose} />}
    </AnimatePresence>
  );
}

/**
 * Mounted only while open, so the form seeds itself from the current profile
 * via useState initialisers — no syncing effect required.
 */
function ProfileDialog({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { profile, save, changeUsername } = useProfile();

  const [form, setForm] = useState({
    displayName: profile?.displayName || user?.displayName || "",
    username: profile?.username || "",
    bio: profile?.bio || "",
  });
  const [saving, setSaving] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const currentUsername = profile?.username ?? "";
  const usernameLocked = currentUsername !== "" && (profile?.usernameEditsUsed ?? 0) >= 1;

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSave = async () => {
    setSaving(true);
    setUsernameError(null);

    try {
      const trimmedUsername = form.username.trim();
      if (trimmedUsername !== currentUsername) {
        await changeUsername(trimmedUsername);
      }

      await save({
        displayName: form.displayName.trim(),
        bio: form.bio.trim(),
      });
      onClose();
    } catch (err) {
      setUsernameError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  };

  const initial =
    (form.displayName || user?.displayName || "?").charAt(0).toUpperCase();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl"
        initial={{ scale: 0.94, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Edit profile</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6 flex items-center gap-4">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              referrerPolicy="no-referrer"
              className="h-16 w-16 rounded-full border border-white/10 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lime text-2xl font-bold text-ink">
              {initial}
            </div>
          )}
          <div className="text-sm text-zinc-400">
            Signed in as
            <div className="text-white">{user?.email}</div>
          </div>
        </div>

        <div className="space-y-4">
          <Field label="Name">
            <input
              value={form.displayName}
              onChange={(e) =>
                setForm({ ...form, displayName: e.target.value })
              }
              placeholder="Your name"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime/50"
            />
          </Field>

          <Field label="Username">
            <div
              className={`flex items-center rounded-xl border px-4 transition ${
                usernameLocked
                  ? "border-white/10 bg-white/[0.02]"
                  : "border-white/10 bg-white/[0.03] focus-within:border-lime/50"
              }`}
            >
              <span className="text-zinc-500">@</span>
              <input
                value={form.username}
                disabled={usernameLocked}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                  })
                }
                placeholder="username"
                className="w-full bg-transparent py-3 pl-1 text-white outline-none placeholder:text-zinc-600 disabled:cursor-not-allowed disabled:text-zinc-500"
              />
              {usernameLocked && <Lock className="h-4 w-4 shrink-0 text-zinc-500" />}
            </div>

            {usernameError ? (
              <p className="mt-1.5 text-xs text-red-400">{usernameError}</p>
            ) : (
              <p className="mt-1.5 text-xs text-zinc-500">
                {usernameLocked
                  ? "Locked — you've already used your one username change."
                  : currentUsername
                    ? "You can change this once. Choose carefully — it locks after that."
                    : "This is permanent after one change, so pick carefully."}
              </p>
            )}
          </Field>

          <Field label="Bio">
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="A short line about you…"
              rows={3}
              maxLength={160}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-lime/50"
            />
            <p className="mt-1 text-right text-xs text-zinc-600">
              {form.bio.length}/160
            </p>
          </Field>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 py-3 font-medium text-zinc-300 transition hover:bg-white/5"
          >
            Cancel
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-xl bg-lime py-3 font-semibold text-ink transition hover:brightness-95 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-300">
        {label}
      </span>
      {children}
    </label>
  );
}

export default ProfileModal;
