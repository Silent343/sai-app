<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: string;
  id: string;
  label: string;
  placeholder?: string;
  showStrength?: boolean;
  error?: string;
}>(), { placeholder: '••••••••', showStrength: false, error: '' });

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();
const revealed = ref(false);

const strength = computed(() => {
  const v = props.modelValue;
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;
  if (/[^A-Za-z0-9]/.test(v)) score++;
  return score; // 0..4
});
const strengthLabel = computed(() => ['—', 'Débil', 'Aceptable', 'Buena', 'Fuerte'][strength.value]);
</script>

<template>
  <div class="field">
    <label class="field__label" :for="id">{{ label }}</label>
    <div class="pw">
      <input
        :id="id"
        class="input"
        :class="{ 'input--error': error }"
        :type="revealed ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        autocomplete="off"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <button type="button" class="pw__toggle" :aria-label="revealed ? 'Ocultar' : 'Mostrar'" @click="revealed = !revealed">
        {{ revealed ? 'Ocultar' : 'Ver' }}
      </button>
    </div>

    <div v-if="showStrength && modelValue" class="pw__meter" :data-score="strength">
      <span v-for="i in 4" :key="i" :class="{ on: i <= strength }" />
      <em>{{ strengthLabel }}</em>
    </div>
    <p v-if="error" class="field__error">{{ error }}</p>
  </div>
</template>

<style scoped>
.pw { position: relative; }
.pw .input { padding-right: 4.2rem; }
.pw__toggle {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: var(--primary-deep);
  font: 600 0.78rem var(--font-body);
  cursor: pointer;
  padding: 0.3rem 0.4rem;
  border-radius: 6px;
}
.pw__toggle:hover { background: var(--surface-3); }
.pw__meter {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.15rem;
}
.pw__meter span {
  height: 4px;
  width: 28px;
  border-radius: 4px;
  background: var(--border-strong);
  transition: background 0.2s var(--ease);
}
.pw__meter span.on { background: var(--accent); }
.pw__meter[data-score="1"] span.on { background: var(--danger); }
.pw__meter[data-score="2"] span.on { background: var(--warning); }
.pw__meter em {
  font-style: normal;
  font-size: 0.72rem;
  color: var(--muted);
  margin-left: 0.3rem;
}
</style>
