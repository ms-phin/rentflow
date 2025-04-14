import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Notification } from "@/types";
import { notifications as mockNotifications } from "@/mocks/data";

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  fetchNotifications: () => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  addNotification: (notification: Notification) => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      loading: false,
      error: null,

      fetchNotifications: () => {
        set({ loading: true, error: null });

        // In a real app, this would be an API call
        // For now, we'll use mock data
        setTimeout(() => {
          set({ notifications: mockNotifications, loading: false });
        }, 500);
      },

      markAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          ),
        }));
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((notification) => ({
            ...notification,
            read: true,
          })),
        }));
      },

      deleteNotification: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.filter(
            (notification) => notification.id !== notificationId
          ),
        }));
      },

      addNotification: (notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
        }));
      },
    }),
    {
      name: "notifications-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
