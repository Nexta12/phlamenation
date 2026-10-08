import { create } from "zustand";

export interface ConfirmOptions {
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
}

interface ConfirmState {
  isOpen: boolean;
  options: ConfirmOptions;
  resolve: ((value: boolean) => void) | null;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  onConfirm: () => void;
  onCancel: () => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  isOpen: false,
  options: {},
  resolve: null,

  confirm: (options) => {
    return new Promise<boolean>((resolve) => {
      set({
        isOpen: true,
        options,
        resolve,
      });
    });
  },

  onConfirm: () => {
    const { resolve } = get();
    if (resolve) resolve(true);
    set({ isOpen: false, resolve: null });
  },

  onCancel: () => {
    const { resolve } = get();
    if (resolve) resolve(false);
    set({ isOpen: false, resolve: null });
  },
}));

export const useConfirmDialog = () => {
  const confirm = useConfirmStore((state) => state.confirm);
  return {
    confirmDelete: (options: ConfirmOptions | string) => {
      const opts: ConfirmOptions =
        typeof options === "string" ? { message: options } : options;
      return confirm({
        title: opts.title || "Confirm Deletion",
        confirmText: opts.confirmText || "Delete Permanently",
        variant: opts.variant || "danger",
        ...opts,
      });
    },
    confirmAction: confirm,
  };
};

export default useConfirmStore;
