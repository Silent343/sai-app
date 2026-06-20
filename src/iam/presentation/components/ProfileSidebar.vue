<script setup lang="ts">
export interface ProfileTab { key: string; label: string; hint: string }

defineProps<{ tabs: ProfileTab[]; active: string }>();
const emit = defineEmits<{ select: [key: string] }>();
</script>

<template>
  <nav class="side" aria-label="Secciones de la cuenta">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="side__item"
      :class="{ 'side__item--active': tab.key === active }"
      @click="emit('select', tab.key)"
    >
      <span class="side__label">{{ tab.label }}</span>
      <span class="side__hint">{{ tab.hint }}</span>
    </button>
  </nav>
</template>

<style scoped>
.side { display: grid; gap: 0.4rem; align-content: start; }
.side__item {
  display: grid;
  gap: 0.15rem;
  text-align: left;
  padding: 0.75rem 0.9rem;
  border: 1px solid transparent;
  border-radius: var(--r-md);
  background: transparent;
  cursor: pointer;
  transition: background 0.16s var(--ease), border-color 0.16s var(--ease);
}
.side__item:hover { background: var(--surface-3); }
.side__item--active {
  background: var(--primary-soft);
  border-color: #bfe3e2;
}
.side__label { font: 600 0.92rem var(--font-body); color: var(--ink); }
.side__hint { font-size: 0.76rem; color: var(--muted); }
.side__item--active .side__label { color: var(--primary-deep); }

@media (max-width: 760px) {
  .side { grid-auto-flow: column; overflow-x: auto; gap: 0.5rem; }
  .side__hint { display: none; }
  .side__item { white-space: nowrap; }
}
</style>
