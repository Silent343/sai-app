import type { Conversation } from '../model/conversation.entity';

/**
 * ConversationRepository port. The application layer persists and retrieves
 * conversations through this abstraction; the json-server adapter implements it.
 */
export interface ConversationRepository {
  /** All conversations owned by a user, most recent first. */
  listByOwner(ownerId: string): Promise<Conversation[]>;
  findById(id: string): Promise<Conversation | null>;
  save(conversation: Conversation): Promise<void>;
  update(conversation: Conversation): Promise<void>;
  delete(id: string): Promise<void>;
}
