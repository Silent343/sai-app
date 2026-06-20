<script setup lang="ts">
import { onMounted, nextTick, ref, watch } from 'vue';
import AppNav from '@/shared/presentation/layout/AppNav.vue';
import { useToast } from '@/shared/presentation/toast/use-toast';
import { useChatStore } from '../stores/chat.store';
import ChatSidebar from '../components/ChatSidebar.vue';
import ChatMessage from '../components/ChatMessage.vue';
import ChatComposer from '../components/ChatComposer.vue';

const chat = useChatStore();
const toast = useToast();
const scroller = ref<HTMLElement | null>(null);

const suggestions = [
  '¿Cuáles son los síntomas del dengue?',
  '¿Cómo prevenir infecciones respiratorias?',
  '¿Qué hago ante fiebre alta persistente?',
];

onMounted(() => chat.loadConversations());

watch(
  () => chat.messages.length,
  async () => {
    await nextTick();
    scroller.value?.scrollTo({ top: scroller.value.scrollHeight, behavior: 'smooth' });
  },
);

async function handleSend(text: string): Promise<void> {
  const error = await chat.send(text);
  if (error) toast.error(error);
}

function handleSelect(id: string): void {
  chat.openConversation(id);
}

function handleCreate(): void {
  chat.newConversation();
}

async function handleRemove(id: string): Promise<void> {
  await chat.remove(id);
  toast.info('Conversación eliminada.');
}
</script>

<template>
  <div class="page">
    <AppNav />

    <div class="chat">
      <ChatSidebar
        :conversations="chat.conversations"
        :active-id="chat.activeId"
        @select="handleSelect"
        @create="handleCreate"
        @remove="handleRemove"
      />

      <main class="chat__main">
        <div ref="scroller" class="chat__scroll">
          <div v-if="chat.messages.length === 0" class="welcome">
            <div class="welcome__mark" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /></svg>
            </div>
            <h1>¿Cómo puedo ayudarte hoy?</h1>
            <p>Orientación sobre enfermedades infecciosas, síntomas y prevención.</p>
            <div class="welcome__chips">
              <button
                v-for="s in suggestions"
                :key="s"
                class="chip"
                :disabled="chat.isSending"
                @click="handleSend(s)"
              >
                {{ s }}
              </button>
            </div>
          </div>

          <div v-else class="thread">
            <ChatMessage v-for="(m, i) in chat.messages" :key="i" :message="m" />
            <div v-if="chat.isSending" class="typing" aria-live="polite">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>

        <div class="chat__composer">
          <ChatComposer :disabled="chat.isSending" @send="handleSend" />
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.page { height: 100vh; display: flex; flex-direction: column; }
.chat { flex: 1; display: flex; min-height: 0; }
.chat__main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.chat__scroll { flex: 1; overflow-y: auto; padding: 1.5rem; }

.thread { display: flex; flex-direction: column; gap: 1.1rem; max-width: 50rem; margin: 0 auto; }

.welcome { max-width: 36rem; margin: auto; text-align: center; padding: 3rem 1rem; }
.welcome__mark {
  width: 56px; height: 56px; margin: 0 auto 1.2rem; border-radius: 16px;
  background: var(--primary-soft); display: grid; place-items: center;
}
.welcome__mark svg { width: 30px; height: 30px; fill: var(--primary); }
.welcome h1 { font-size: 1.6rem; }
.welcome p { color: var(--muted); margin-top: 0.6rem; }
.welcome__chips { margin-top: 1.6rem; display: flex; flex-direction: column; gap: 0.55rem; }
.chip {
  padding: 0.7rem 1rem; border: 1px solid var(--border); border-radius: var(--r-md);
  background: var(--surface); color: var(--ink-soft); font-size: 0.9rem; cursor: pointer;
  text-align: left; transition: border-color 0.15s var(--ease), background 0.15s var(--ease);
}
.chip:hover:not(:disabled) { border-color: var(--accent); background: var(--surface-3); }
.chip:disabled { opacity: 0.5; cursor: not-allowed; }

.chat__composer { padding: 0.5rem 1.5rem 1.4rem; max-width: 50rem; width: 100%; margin: 0 auto; }

.typing { display: flex; gap: 0.3rem; padding: 0.6rem 0.2rem; }
.typing span {
  width: 8px; height: 8px; border-radius: 50%; background: var(--faint);
  animation: blink 1.2s infinite ease-in-out;
}
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes blink { 0%, 80%, 100% { opacity: 0.25; } 40% { opacity: 1; } }

@media (max-width: 760px) {
  .chat { flex-direction: column; }
}
</style>
