import { reactive, readonly } from 'vue';

export type ToastKind = 'success' | 'error' | 'info';
export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

const state = reactive<{ items: Toast[] }>({ items: [] });
let seq = 0;

function push(kind: ToastKind, message: string, ttl = 3200): void {
  const id = ++seq;
  state.items.push({ id, kind, message });
  window.setTimeout(() => dismiss(id), ttl);
}

function dismiss(id: number): void {
  const index = state.items.findIndex((t) => t.id === id);
  if (index !== -1) state.items.splice(index, 1);
}

/** Global, framework-agnostic toast feed shared across the app. */
export function useToast() {
  return {
    toasts: readonly(state).items,
    success: (m: string) => push('success', m),
    error: (m: string) => push('error', m),
    info: (m: string) => push('info', m),
    dismiss,
  };
}
