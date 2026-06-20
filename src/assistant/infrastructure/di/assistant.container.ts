import { AxiosHttpClient } from '@/shared/infrastructure/http/axios-http-client';
import { UuidIdGenerator } from '@/shared/infrastructure/uuid-id-generator';
import { TOKEN_STORAGE_KEY } from '@/iam/infrastructure/di/iam.container';

import { ConversationApiRepository } from '../persistence/conversation-api.repository';
import { GeminiChatAssistant } from '../assistant/gemini-chat-assistant';

import { SendMessageUseCase } from '../../application/use-cases/send-message.use-case';
import { ListConversationsUseCase } from '../../application/use-cases/list-conversations.use-case';
import { GetConversationUseCase } from '../../application/use-cases/get-conversation.use-case';
import { DeleteConversationUseCase } from '../../application/use-cases/delete-conversation.use-case';

/**
 * Composition root for the Assistant bounded context.
 *
 * Two transports are wired here, each behind the same HttpClient port:
 *  - the json-server API (conversation persistence)
 *  - the Gemini proxy (AI replies)
 * The use cases depend only on ports; this is the single place that knows which
 * concrete adapter and base URL each one uses.
 */
function buildAssistantContainer() {
  const apiBaseURL = import.meta.env.VITE_API_BASE_URL;
  const assistantBaseURL = import.meta.env.VITE_ASSISTANT_API_URL;

  const tokenReader = () => localStorage.getItem(TOKEN_STORAGE_KEY);
  const apiHttp = new AxiosHttpClient(apiBaseURL, tokenReader);
  const assistantHttp = new AxiosHttpClient(assistantBaseURL, tokenReader);

  const conversations = new ConversationApiRepository(apiHttp);
  const assistant = new GeminiChatAssistant(assistantHttp);
  const idGenerator = new UuidIdGenerator();

  return {
    sendMessage: new SendMessageUseCase(conversations, assistant, idGenerator),
    listConversations: new ListConversationsUseCase(conversations),
    getConversation: new GetConversationUseCase(conversations),
    deleteConversation: new DeleteConversationUseCase(conversations),
  } as const;
}

export type AssistantContainer = ReturnType<typeof buildAssistantContainer>;

export const assistant: AssistantContainer = buildAssistantContainer();
