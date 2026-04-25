import { create } from "zustand";

export type ToastType = "error" | "success" | "info";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastState {
  toasts: Toast[];
  show(message: string, type?: ToastType): void;
  dismiss(id: number): void;
}

let _nextId = 0;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show(message, type = "info") {
    const id = ++_nextId;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  dismiss(id) {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));

/** Call from anywhere (including store action wrappers). */
export function toast(message: string, type: ToastType = "info") {
  useToastStore.getState().show(message, type);
}
