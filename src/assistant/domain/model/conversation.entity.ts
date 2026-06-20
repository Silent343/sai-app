import { Entity } from '@/shared/domain/entity';
import { ConversationId } from './conversation-id.vo';
import { ChatMessage } from './chat-message.vo';

export interface ConversationProps {
  ownerId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_TITLE = 'Nueva conversación';
const TITLE_MAX = 40;

/**
 * Conversation aggregate root. Owns its list of messages and the invariants
 * around them: a conversation belongs to one user, keeps messages in order, and
 * derives its title from the first thing the user asked. All mutation goes
 * through behavior methods — callers never push into the array directly.
 */
export class Conversation extends Entity<ConversationId> {
  private constructor(id: ConversationId, private props: ConversationProps) {
    super(id);
  }

  /** Starts a brand-new, empty conversation for an owner. */
  static start(id: string, ownerId: string): Conversation {
    const now = new Date().toISOString();
    return new Conversation(ConversationId.of(id), {
      ownerId,
      title: DEFAULT_TITLE,
      messages: [],
      createdAt: now,
      updatedAt: now,
    });
  }

  /** Restores a conversation from persistence. */
  static rehydrate(id: string, props: ConversationProps): Conversation {
    return new Conversation(ConversationId.of(id), props);
  }

  get conversationId(): string {
    return this.id.value;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get title(): string {
    return this.props.title;
  }

  get messages(): readonly ChatMessage[] {
    return this.props.messages;
  }

  get createdAt(): string {
    return this.props.createdAt;
  }

  get updatedAt(): string {
    return this.props.updatedAt;
  }

  get isEmpty(): boolean {
    return this.props.messages.length === 0;
  }

  /** Adds the user's turn; the first user message seeds the conversation title. */
  addUserMessage(content: string): ChatMessage {
    const message = ChatMessage.user(content);
    if (this.isEmpty) {
      this.props.title = deriveTitle(content);
    }
    this.props.messages.push(message);
    this.touch();
    return message;
  }

  /** Adds the assistant's reply. */
  addAssistantMessage(content: string): ChatMessage {
    const message = ChatMessage.assistant(content);
    this.props.messages.push(message);
    this.touch();
    return message;
  }

  /** History formatted for an assistant port (plain role/content turns). */
  history(): { role: 'user' | 'assistant'; content: string }[] {
    return this.props.messages.map((m) => ({ role: m.role, content: m.content }));
  }

  private touch(): void {
    this.props.updatedAt = new Date().toISOString();
  }
}

function deriveTitle(firstMessage: string): string {
  const clean = firstMessage.trim().replace(/\s+/g, ' ');
  if (clean.length === 0) return DEFAULT_TITLE;
  return clean.length > TITLE_MAX ? `${clean.slice(0, TITLE_MAX).trimEnd()}…` : clean;
}
