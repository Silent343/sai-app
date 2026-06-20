import type { ChatRole } from '../../domain/model/chat-message.vo';

/** Read model of a single message. */
export interface ChatMessageDto {
  role: ChatRole;
  content: string;
  sentAt: string;
}

/** Read model of a conversation exposed to the presentation layer. */
export interface ConversationDto {
  id: string;
  title: string;
  messages: ChatMessageDto[];
  createdAt: string;
  updatedAt: string;
}

/** Lightweight summary for the sidebar list (no message bodies). */
export interface ConversationSummaryDto {
  id: string;
  title: string;
  updatedAt: string;
}

export interface StartConversationCommand {
  ownerId: string;
}

export interface SendMessageCommand {
  conversationId: string | null;
  ownerId: string;
  content: string;
}
