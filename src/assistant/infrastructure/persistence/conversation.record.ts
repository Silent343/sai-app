import { Conversation } from '../../domain/model/conversation.entity';
import { ChatMessage, type ChatRole } from '../../domain/model/chat-message.vo';

/** Raw row shape stored in db.json / returned by json-server. */
export interface ConversationRecord {
  id: string;
  ownerId: string;
  title: string;
  messages: Array<{ role: string; content: string; sentAt: string }>;
  createdAt: string;
  updatedAt: string;
}

/** Maps between the persistence record and the Conversation aggregate. */
export class ConversationAssembler {
  static toDomain(record: ConversationRecord): Conversation {
    const messages = (record.messages ?? []).map((m) =>
      ChatMessage.rehydrate({
        role: normalizeRole(m.role),
        content: m.content,
        sentAt: m.sentAt,
      }),
    );

    return Conversation.rehydrate(record.id, {
      ownerId: record.ownerId,
      title: record.title,
      messages,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toRecord(conversation: Conversation): ConversationRecord {
    return {
      id: conversation.conversationId,
      ownerId: conversation.ownerId,
      title: conversation.title,
      messages: conversation.messages.map((m) => ({
        role: m.role,
        content: m.content,
        sentAt: m.sentAt,
      })),
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
  }
}

function normalizeRole(role: string): ChatRole {
  return role === 'assistant' ? 'assistant' : 'user';
}
