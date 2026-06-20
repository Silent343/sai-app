import type { Conversation } from '../../domain/model/conversation.entity';
import type {
  ConversationDto,
  ConversationSummaryDto,
  ChatMessageDto,
} from '../dto/conversation.dto';

/** Translates the Conversation aggregate into read models. */
export const ConversationMapper = {
  toDto(conversation: Conversation): ConversationDto {
    return {
      id: conversation.conversationId,
      title: conversation.title,
      messages: conversation.messages.map(toMessageDto),
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  },

  toSummary(conversation: Conversation): ConversationSummaryDto {
    return {
      id: conversation.conversationId,
      title: conversation.title,
      updatedAt: conversation.updatedAt,
    };
  },
};

function toMessageDto(message: {
  role: ChatMessageDto['role'];
  content: string;
  sentAt: string;
}): ChatMessageDto {
  return { role: message.role, content: message.content, sentAt: message.sentAt };
}
