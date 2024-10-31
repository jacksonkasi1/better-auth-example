// lib/useUserStore.ts
import {create} from "zustand";

interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

interface UserStore {
  profile: UserProfile | null;
  sessionId: string | null;
  setProfile: (profile: UserProfile | null) => void;
  setSessionId: (sessionId: string) => void;
  clearUserData: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  sessionId: null,
  setProfile: (profile) => set({ profile }),
  setSessionId: (sessionId) => set({ sessionId }),
  clearUserData: () => set({ profile: null, sessionId: null }),
}));
