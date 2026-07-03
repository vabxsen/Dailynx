import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./AuthContext";
import {
  getProfile,
  saveProfile,
  type Profile,
} from "../services/profileService";

interface ProfileContextType {
  profile: Profile | null;
  /** Display name preferring the custom profile, falling back to Google. */
  displayName: string;
  save: (profile: Profile) => Promise<void>;
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

  const save = async (next: Profile) => {
    if (!user) return;

    setProfile(next);
    await saveProfile(user.uid, next);
  };

  const displayName =
    profile?.displayName?.trim() || user?.displayName || "there";

  return (
    <ProfileContext.Provider value={{ profile, displayName, save }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const ctx = useContext(ProfileContext);

  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");

  return ctx;
};
