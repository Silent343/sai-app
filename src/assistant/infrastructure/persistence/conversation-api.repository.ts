import type { HttpClient } from '@/shared/infrastructure/http/http-client';
import type { ConversationRepository } from '../../domain/repositories/conversation.repository';
import type { Conversation } from '../../domain/model/conversation.entity';
import { ConversationAssembler, type ConversationRecord } from './conversation.record';

/**
 * REST adapter for ConversationRepository, backed by json-server.
 * CRUD over /conversations:
 *   GET /conversations?ownerId=&_sort=updatedAt&_order=desc
 *   GET /conversations/:id, POST, PATCH /:id, DELETE /:id
 */
export class ConversationApiRepository implements ConversationRepository {
  private readonly resource = '/conversations';

  constructor(private readonly http: HttpClient) {}

  async listByOwner(ownerId: string): Promise<Conversation[]> {
    const records = await this.http.get<ConversationRecord[]>(this.resource, {
      ownerId,
      _sort: 'updatedAt',
      _order: 'desc',
    });
    return records.map(ConversationAssembler.toDomain);
  }

  async findById(id: string): Promise<Conversation | null> {
    try {
      const record = await this.http.get<ConversationRecord>(`${this.resource}/${id}`);
      return ConversationAssembler.toDomain(record);
    } catch {
      return null;
    }
  }

  async save(conversation: Conversation): Promise<void> {
    await this.http.post<ConversationRecord>(
      this.resource,
      ConversationAssembler.toRecord(conversation),
    );
  }

  async update(conversation: Conversation): Promise<void> {
    await this.http.patch<ConversationRecord>(
      `${this.resource}/${conversation.conversationId}`,
      ConversationAssembler.toRecord(conversation),
    );
  }

  async delete(id: string): Promise<void> {
    await this.http.delete(`${this.resource}/${id}`);
  }
}
