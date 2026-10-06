import { create } from "zustand";
import { Video, Artist } from "@/types";

export interface Toast {
  id: string;
  type: "success" | "error" | "info";
  title?: string;
  message: string;
}

interface UIState {
  mobileMenuOpen: boolean;
  activeVideoModal: Video | null;
  activeRequestShowModal: Artist | null;
  toasts: Toast[];

  setMobileMenuOpen: (open: boolean) => void;
  openVideoModal: (video: Video) => void;
  closeVideoModal: () => void;
  openRequestShowModal: (artist: Artist) => void;
  closeRequestShowModal: () => void;
  addToast: (
    payload: string | { title?: string; message: string; type?: "success" | "error" | "info" },
    type?: "success" | "error" | "info"
  ) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  activeVideoModal: null,
  activeRequestShowModal: null,
  toasts: [],

  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
  openVideoModal: (video) => set({ activeVideoModal: video }),
  closeVideoModal: () => set({ activeVideoModal: null }),
  openRequestShowModal: (artist) => set({ activeRequestShowModal: artist }),
  closeRequestShowModal: () => set({ activeRequestShowModal: null }),

  addToast: (payload, defaultType = "info") => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    let title: string | undefined;
    let message = "";
    let toastType = defaultType;

    if (typeof payload === "string") {
      message = payload;
    } else {
      title = payload.title;
      message = payload.message;
      if (payload.type) toastType = payload.type;
    }

    set((state) => ({
      toasts: [...state.toasts, { id, type: toastType, title, message }],
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4500);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export default useUIStore;
