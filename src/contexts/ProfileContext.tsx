import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./AuthContext";
import {
  EMPTY_PROFILE,
  getProfile,
  saveProfile,
  type Profile,
} from "../services/profileService";
import { claimUsername } from "../services/usernameService";

interface ProfileContextType {
  profile: Profile | null;
  /** Display name preferring the custom profile, falling back to Google. */
  displayName: string;
  save: (patch: { displayName: string; bio: string }) => Promise<void>;
  /** Throws if the username is taken, invalid, or the one-time edit is used up. */
  changeUsername: (username: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      if (!user) return;

      const data = await getProfile(user.uid);
      if (active) setProfile(data);
    })();

    return () => {
      active = false;
    };
  }, [user]);

  const save = async (patch: { displayName: string; bio: string }) => {
    if (!user) return;

    // Merge onto EMPTY_PROFILE (not bail to null) — a user with no prior
    // profile doc must still end up with real local state after saving,
    // otherwise every future edit looks like a fresh first-time set.
    setProfile((prev) => ({ ...(prev ?? EMPTY_PROFILE), ...patch }));
    await saveProfile(user.uid, patch);
  };

  const changeUsername = async (username: string) => {
    if (!user) return;

    const result = await claimUsername(user.uid, username, {
      username: profile?.username ?? "",
      usernameEditsUsed: profile?.usernameEditsUsed ?? 0,
    });

    setProfile((prev) => ({ ...(prev ?? EMPTY_PROFILE), ...result }));
  };

  const displayName =
    profile?.displayName?.trim() || user?.displayName || "there";

  return (
    <ProfileContext.Provider
      value={{ profile, displayName, save, changeUsername }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const ctx = useContext(ProfileContext);

  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");

  return ctx;
};
