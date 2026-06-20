<script setup lang="ts">
import { useToast } from './use-toast';
const { toasts, dismiss } = useToast();

const icon: Record<string, string> = { success: '✓', error: '!', info: 'i' };
</script>

<template>
  <div class="toast-stack" role="status" aria-live="polite">
    <TransitionGroup name="toast">
      <button
        v-for="t in toasts"
        :key="t.id"
        class="toast"
        :class="`toast--${t.kind}`"
        @click="dismiss(t.id)"
      >
        <span class="toast__badge">{{ icon[t.kind] }}</span>
        <span class="toast__msg">{{ t.message }}</span>
      </button>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 80;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-width: min(92vw, 22rem);
}
.toast {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.8rem 0.95rem;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--surface);
  box-shadow: var(--shadow-md);
  font: 500 0.9rem/1.3 var(--font-body);
  color: var(--ink);
  text-align: left;
  cursor: pointer;
}
.toast__badge {
  display: grid;
  place-items: center;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.8rem;
  color: #fff;
  flex-shrink: 0;
}
.toast--success .toast__badge { background: var(--success); }
.toast--error   .toast__badge { background: var(--danger); }
.toast--info    .toast__badge { background: var(--primary); }
.toast--success { border-left: 3px solid var(--success); }
.toast--error   { border-left: 3px solid var(--danger); }
.toast--info    { border-left: 3px solid var(--primary); }

.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from { opacity: 0; transform: translateX(16px); }
.toast-leave-to   { opacity: 0; transform: translateX(16px); }
</style>
