import { defineStore } from 'pinia';
import { assistant } from '../../infrastructure/di/assistant.container';
import { useAuthStore } from '@/iam/presentation/stores/auth.store';
import type {
  ConversationDto,
  ConversationSummaryDto,
} from '../../application/dto/conversation.dto';

type ChatStatus = 'idle' | 'loading' | 'sending';

interface ChatState {
  conversations: ConversationSummaryDto[];
  active: ConversationDto | null;
  status: ChatStatus;
}

/**
 * Chat store — presentation entry point to the Assistant use cases.
 * Holds the sidebar list and the active conversation; delegates every operation
 * to a use case and never contains business rules itself.
 */
export const useChatStore = defineStore('assistant-chat', {
  state: (): ChatState => ({
    conversations: [],
    active: null,
    status: 'idle',
  }),

  getters: {
    isSending: (state): boolean => state.status === 'sending',
    isLoading: (state): boolean => state.status === 'loading',
    messages: (state) => state.active?.messages ?? [],
    activeId: (state): string | null => state.active?.id ?? null,
  },

  actions: {
    async loadConversations(): Promise<void> {
      const ownerId = this.ownerId();
      if (!ownerId) return;
      this.status = 'loading';
      try {
        const result = await assistant.listConversations.execute(ownerId);
        if (result.isOk()) this.conversations = result.value;
      } finally {
        this.status = 'idle';
      }
    },

    async openConversation(id: string): Promise<void> {
      this.status = 'loading';
      try {
        const result = await assistant.getConversation.execute(id);
        if (result.isOk()) this.active = result.value;
      } finally {
        this.status = 'idle';
      }
    },

    /** Clears the active conversation so the next message starts a fresh one. */
    newConversation(): void {
      this.active = null;
    },

    async send(content: string): Promise<string | null> {
      const ownerId = this.ownerId();
      if (!ownerId) return 'Tu sesión expiró. Vuelve a iniciar sesión.';

      this.status = 'sending';
      try {
        const result = await assistant.sendMessage.execute({
          conversationId: this.active?.id ?? null,
          ownerId,
          content,
        });
        if (result.isErr()) return result.error.message;

        this.active = result.value;
        this.upsertSummary(result.value);
        return null;
      } finally {
        this.status = 'idle';
      }
    },

    async remove(id: string): Promise<void> {
      const result = await assistant.deleteConversation.execute(id);
      if (result.isErr()) return;
      this.conversations = this.conversations.filter((c) => c.id !== id);
      if (this.active?.id === id) this.active = null;
    },

    // ---- helpers ----
    ownerId(): string | null {
      return useAuthStore().currentUser?.id ?? null;
    },

    upsertSummary(conversation: ConversationDto): void {
      const summary: ConversationSummaryDto = {
        id: conversation.id,
        title: conversation.title,
        updatedAt: conversation.updatedAt,
      };
      const rest = this.conversations.filter((c) => c.id !== summary.id);
      this.conversations = [summary, ...rest];
    },
  },
});
