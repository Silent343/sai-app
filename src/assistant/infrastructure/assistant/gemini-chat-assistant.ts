import type { HttpClient } from '@/shared/infrastructure/http/http-client';
import type { ChatAssistant, AssistantTurn } from '../../domain/services/chat-assistant';

interface ReplyResponse {
  reply: string;
}

/**
 * ChatAssistant adapter backed by the SAI Gemini proxy.
 *
 * Note it talks to *our own* backend (`/assistant/reply`), never to Google
 * directly — the API key stays server-side. The domain only knows the
 * ChatAssistant port; swapping Gemini for another model is a server change.
 */
export class GeminiChatAssistant implements ChatAssistant {
  private readonly endpoint = '/assistant/reply';

  constructor(private readonly http: HttpClient) {}

  async reply(history: AssistantTurn[]): Promise<string> {
    const { reply } = await this.http.post<ReplyResponse>(this.endpoint, {
      messages: history,
    });
    return reply;
  }
}
