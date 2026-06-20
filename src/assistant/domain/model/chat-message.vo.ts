import { ValueObject } from '@/shared/domain/value-object';

export type ChatRole = 'user' | 'assistant';

interface ChatMessageProps {
  role: ChatRole;
  content: string;
  sentAt: string; // ISO timestamp
}

/**
 * A single turn in a conversation. Immutable value object: once said, a message
 * doesn't change. Equality is by value (role + content + timestamp).
 */
export class ChatMessage extends ValueObject<ChatMessageProps> {
  private constructor(props: ChatMessageProps) {
    super(props);
  }

  static user(content: string, sentAt: string = new Date().toISOString()): ChatMessage {
    return new ChatMessage({ role: 'user', content, sentAt });
  }

  static assistant(content: string, sentAt: string = new Date().toISOString()): ChatMessage {
    return new ChatMessage({ role: 'assistant', content, sentAt });
  }

  static rehydrate(props: ChatMessageProps): ChatMessage {
    return new ChatMessage(props);
  }

  get role(): ChatRole {
    return this.props.role;
  }

  get content(): string {
    return this.props.content;
  }

  get sentAt(): string {
    return this.props.sentAt;
  }

  get isFromUser(): boolean {
    return this.props.role === 'user';
  }
}
