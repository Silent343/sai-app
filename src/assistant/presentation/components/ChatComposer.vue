<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{ disabled: boolean }>();
const emit = defineEmits<{ send: [text: string] }>();

const text = ref('');

function submit(): void {
  const value = text.value.trim();
  if (!value || props.disabled) return;
  emit('send', value);
  text.value = '';
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    submit();
  }
}
</script>

<template>
  <div class="composer">
    <textarea
      v-model="text"
      class="composer__input"
      rows="1"
      placeholder="Pregúntame sobre síntomas, prevención, enfermedades…"
      :disabled="disabled"
      @keydown="onKeydown"
    ></textarea>
    <button class="composer__send" :disabled="disabled || text.trim().length === 0" @click="submit">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-3-7-7-1z" /></svg>
      <span class="sr">Enviar</span>
    </button>
  </div>
  <p class="composer__hint">
    SAI ofrece orientación general y no reemplaza a un profesional de salud.
  </p>
</template>

<style scoped>
.composer {
  display: flex; align-items: flex-end; gap: 0.6rem;
  background: var(--surface); border: 1px solid var(--border-strong);
  border-radius: var(--r-lg); padding: 0.55rem 0.55rem 0.55rem 0.9rem;
  box-shadow: var(--shadow-sm);
}
.composer:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(47, 163, 155, 0.16); }
.composer__input {
  flex: 1; border: none; resize: none; background: transparent;
  font: 400 0.97rem var(--font-body); color: var(--ink);
  max-height: 9rem; line-height: 1.5; padding: 0.35rem 0;
}
.composer__input:focus { outline: none; }
.composer__send {
  flex-shrink: 0; width: 42px; height: 42px; border-radius: var(--r-md);
  border: none; background: var(--primary); cursor: pointer;
  display: grid; place-items: center; transition: background 0.15s var(--ease);
}
.composer__send:hover:not(:disabled) { background: var(--primary-deep); }
.composer__send:disabled { opacity: 0.45; cursor: not-allowed; }
.composer__send svg { width: 20px; height: 20px; fill: #fff; }
.composer__hint { text-align: center; font-size: 0.72rem; color: var(--faint); margin: 0.6rem 0 0; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
</style>
