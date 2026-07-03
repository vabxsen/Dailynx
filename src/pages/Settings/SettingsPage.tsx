import { useState } from "react";
import { Pencil, LogOut, Smartphone } from "lucide-react";

import PageHeader from "../../components/layout/PageHeader";
import InstallButton from "../../components/layout/InstallButton";
import ProfileModal from "../../components/profile/ProfileModal";
import { useAuth } from "../../contexts/AuthContext";
import { useProfile } from "../../contexts/ProfileContext";

function SettingsPage() {
  const { user, logout } = useAuth();
  const { profile, displayName } = useProfile();
  const [editing, setEditing] = useState(false);

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your profile, app, and account."
      />

      {/* Profile */}
      <Section title="Profile">
        <div className="flex items-center gap-4">
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

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-white">{displayName}</p>
            {profile?.username && (
              <p className="truncate text-sm text-lime">@{profile.username}</p>
            )}
            <p className="mt-1 line-clamp-2 text-sm text-zinc-400">
              {profile?.bio || "No bio yet."}
            </p>
          </div>

          <button
            onClick={() => setEditing(true)}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/5"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
        </div>
      </Section>

      {/* Install */}
      <Section title="App">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-zinc-300">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium text-white">Install LifeOS</p>
              <p className="text-sm text-zinc-400">
                Add it to your home screen for a full-screen, offline app.
              </p>
            </div>
          </div>
          <div className="sm:w-44">
            <InstallButton />
          </div>
        </div>
      </Section>

      {/* Account */}
      <Section title="Account">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm text-zinc-400">Signed in as</p>
            <p className="truncate text-white">{user?.email}</p>
          </div>
          <button
            onClick={() => logout()}
            className="flex shrink-0 items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </Section>

      <p className="pt-2 text-center text-xs text-zinc-600">LifeOS · v1.0</p>

      <ProfileModal open={editing} onClose={() => setEditing(false)} />
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default SettingsPage;
