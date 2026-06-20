import type { UseCase } from '@/shared/application/use-case';
import { ok, err, type Result } from '@/shared/domain/result';
import type { DomainError } from '@/shared/domain/domain-error';

import type { ConversationRepository } from '../../domain/repositories/conversation.repository';
import { ConversationNotFoundError } from '../../domain/errors/assistant.errors';
import type { ConversationDto } from '../dto/conversation.dto';
import { ConversationMapper } from '../mappers/conversation.mapper';

/** Loads a single conversation with its full message history. */
export class GetConversationUseCase
  implements UseCase<string, Result<ConversationDto, DomainError>>
{
  constructor(private readonly conversations: ConversationRepository) {}

  async execute(id: string): Promise<Result<ConversationDto, DomainError>> {
    const conversation = await this.conversations.findById(id);
    if (!conversation) return err(new ConversationNotFoundError());
    return ok(ConversationMapper.toDto(conversation));
  }
}
