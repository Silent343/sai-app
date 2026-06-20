<script setup lang="ts">
import type { ConversationSummaryDto } from '../../application/dto/conversation.dto';

defineProps<{
  conversations: ConversationSummaryDto[];
  activeId: string | null;
}>();

const emit = defineEmits<{
  select: [id: string];
  create: [];
  remove: [id: string];
}>();

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return 'ahora';
  if (min < 60) return `hace ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `hace ${h} h`;
  return new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
}
</script>

<template>
  <aside class="side">
    <button class="side__new btn btn--primary btn--block" @click="emit('create')">
      <svg viewBox="0 0 24 24" class="plus"><path d="M12 5v14M5 12h14" /></svg>
      Nueva conversación
    </button>

    <p class="side__label">Recientes</p>

    <div class="side__list">
      <p v-if="conversations.length === 0" class="side__empty">
        Aún no tienes conversaciones.
      </p>

      <div
        v-for="c in conversations"
        :key="c.id"
        class="item"
        :class="{ 'item--active': c.id === activeId }"
        @click="emit('select', c.id)"
      >
        <div class="item__text">
          <p class="item__title">{{ c.title }}</p>
          <span class="item__time">{{ relativeTime(c.updatedAt) }}</span>
        </div>
        <button
          class="item__del"
          title="Eliminar"
          @click.stop="emit('remove', c.id)"
        >
          <svg viewBox="0 0 24 24"><path d="M5 7h14M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.side {
  width: 16rem; flex-shrink: 0;
  border-right: 1px solid var(--border); background: var(--surface);
  padding: 1rem; display: flex; flex-direction: column; gap: 0.9rem;
}
.plus { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
.side__label {
  font: 600 0.7rem var(--font-body); letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--faint); margin: 0.2rem 0 0;
}
.side__list { display: flex; flex-direction: column; gap: 0.25rem; overflow-y: auto; }
.side__empty { color: var(--muted); font-size: 0.85rem; padding: 0.5rem 0.2rem; }

.item {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.55rem 0.6rem; border-radius: var(--r-sm); cursor: pointer;
  transition: background 0.14s var(--ease);
}
.item:hover { background: var(--surface-3); }
.item--active { background: var(--primary-soft); }
.item__text { min-width: 0; flex: 1; }
.item__title {
  margin: 0; font-weight: 600; font-size: 0.88rem; color: var(--ink-soft);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.item--active .item__title { color: var(--primary-deep); }
.item__time { font-size: 0.7rem; color: var(--faint); }
.item__del {
  flex-shrink: 0; width: 26px; height: 26px; border: none; background: transparent;
  border-radius: 6px; cursor: pointer; opacity: 0; transition: opacity 0.14s, background 0.14s;
}
.item:hover .item__del { opacity: 1; }
.item__del:hover { background: var(--danger-soft); }
.item__del svg { width: 15px; height: 15px; fill: none; stroke: var(--danger); stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }

@media (max-width: 760px) {
  .side { width: 100%; border-right: none; border-bottom: 1px solid var(--border); }
}
</style>
