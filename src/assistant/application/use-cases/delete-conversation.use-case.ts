import type { UseCase } from '@/shared/application/use-case';
import { ok, type Result } from '@/shared/domain/result';
import type { DomainError } from '@/shared/domain/domain-error';

import type { ConversationRepository } from '../../domain/repositories/conversation.repository';

/** Removes a conversation permanently. */
export class DeleteConversationUseCase
  implements UseCase<string, Result<void, DomainError>>
{
  constructor(private readonly conversations: ConversationRepository) {}

  async execute(id: string): Promise<Result<void, DomainError>> {
    await this.conversations.delete(id);
    return ok(undefined);
  }
}
