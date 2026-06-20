import { ValueObject } from '@/shared/domain/value-object';

/** Identity of a Conversation. Wraps a UUID string. */
export class ConversationId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static of(value: string): ConversationId {
    return new ConversationId(value);
  }

  toString(): string {
    return this.value;
  }
}
