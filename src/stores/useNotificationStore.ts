import { create } from "zustand";
import { contactService } from "@/services/api";

interface NotificationStore {
  unreadMessagesCount: number;
  isLoading: boolean;
  setUnreadMessagesCount: (count: number) => void;
  decrementUnreadCount: () => void;
  fetchUnreadCount: () => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  unreadMessagesCount: 0,
  isLoading: false,

  setUnreadMessagesCount: (count: number) =>
    set({ unreadMessagesCount: Math.max(0, count) }),

  decrementUnreadCount: () =>
    set((state) => ({
      unreadMessagesCount: Math.max(0, state.unreadMessagesCount - 1),
    })),

  fetchUnreadCount: async () => {
    try {
      set({ isLoading: true });
      const res = await contactService.getUnreadCount();
      if (res && res.data && typeof res.data.unreadCount === "number") {
        set({ unreadMessagesCount: res.data.unreadCount });
      }
    } catch (err) {
      // Graceful fallback without crashing
      console.warn("Could not fetch unread count:", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useNotificationStore;
