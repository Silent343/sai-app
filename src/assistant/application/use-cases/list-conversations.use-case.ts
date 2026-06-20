import type { UseCase } from '@/shared/application/use-case';
import { ok, type Result } from '@/shared/domain/result';
import type { DomainError } from '@/shared/domain/domain-error';

import type { ConversationRepository } from '../../domain/repositories/conversation.repository';
import type { ConversationSummaryDto } from '../dto/conversation.dto';
import { ConversationMapper } from '../mappers/conversation.mapper';

/** Lists a user's conversations as lightweight summaries for the sidebar. */
export class ListConversationsUseCase
  implements UseCase<string, Result<ConversationSummaryDto[], DomainError>>
{
  constructor(private readonly conversations: ConversationRepository) {}

  async execute(ownerId: string): Promise<Result<ConversationSummaryDto[], DomainError>> {
    const list = await this.conversations.listByOwner(ownerId);
    return ok(list.map(ConversationMapper.toSummary));
  }
}
