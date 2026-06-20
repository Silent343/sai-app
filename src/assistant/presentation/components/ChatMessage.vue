<script setup lang="ts">
import type { ChatMessageDto } from '../../application/dto/conversation.dto';

const props = defineProps<{ message: ChatMessageDto }>();

const time = new Date(props.message.sentAt).toLocaleTimeString('es-PE', {
  hour: '2-digit',
  minute: '2-digit',
});
</script>

<template>
  <div class="msg" :class="message.role === 'user' ? 'msg--user' : 'msg--ai'">
    <div class="msg__avatar" aria-hidden="true">
      <span v-if="message.role === 'user'">Tú</span>
      <svg v-else viewBox="0 0 24 24" class="msg__spark">
        <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
      </svg>
    </div>
    <div class="msg__body">
      <p class="msg__text">{{ message.content }}</p>
      <span class="msg__time mono">{{ time }}</span>
    </div>
  </div>
</template>

<style scoped>
.msg { display: flex; gap: 0.75rem; max-width: 46rem; }
.msg--user { flex-direction: row-reverse; margin-left: auto; }

.msg__avatar {
  flex-shrink: 0; width: 34px; height: 34px; border-radius: 10px;
  display: grid; place-items: center;
  font: 700 0.72rem var(--font-display);
}
.msg--user .msg__avatar { background: var(--ink); color: #fff; }
.msg--ai .msg__avatar { background: var(--primary-soft); color: var(--primary-deep); }
.msg__spark { width: 20px; height: 20px; fill: var(--primary); }

.msg__body {
  padding: 0.7rem 0.95rem; border-radius: var(--r-md);
  border: 1px solid var(--border); background: var(--surface);
}
.msg--user .msg__body { background: var(--primary); border-color: var(--primary); }
.msg--user .msg__text { color: #fff; }
.msg--user .msg__time { color: rgba(255, 255, 255, 0.7); }

.msg__text { margin: 0; line-height: 1.55; white-space: pre-wrap; word-break: break-word; }
.msg__time { display: block; margin-top: 0.35rem; font-size: 0.68rem; color: var(--faint); }
</style>
