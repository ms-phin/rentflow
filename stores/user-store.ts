import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types";
import { currentUser as mockUser } from "@/mocks/data";

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      fetchUser: () => {
        set({ loading: true, error: null });

        // In a real app, this would be an API call
        // For now, we'll use mock data
        setTimeout(() => {
          set({ user: mockUser, loading: false });
        }, 500);
      },

      updateUser: (user) => {
        set({ user });
      },

      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
