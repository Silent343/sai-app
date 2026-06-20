import type { UseCase } from '@/shared/application/use-case';
import { ok, err, type Result } from '@/shared/domain/result';
import type { DomainError } from '@/shared/domain/domain-error';
import type { IdGenerator } from '@/shared/application/id-generator';

import type { ConversationRepository } from '../../domain/repositories/conversation.repository';
import type { ChatAssistant } from '../../domain/services/chat-assistant';
import { Conversation } from '../../domain/model/conversation.entity';
import {
  EmptyMessageError,
  AssistantUnavailableError,
} from '../../domain/errors/assistant.errors';

import type { SendMessageCommand, ConversationDto } from '../dto/conversation.dto';
import { ConversationMapper } from '../mappers/conversation.mapper';

/**
 * Sends a user message and returns the updated conversation including the
 * assistant's reply. Creates the conversation on the fly if it doesn't exist
 * yet, so the UI can start typing before anything is persisted.
 *
 * Orchestration only — every rule lives in the Conversation aggregate or the
 * value objects; this use case just wires the steps and persists the result.
 */
export class SendMessageUseCase
  implements UseCase<SendMessageCommand, Result<ConversationDto, DomainError>>
{
  constructor(
    private readonly conversations: ConversationRepository,
    private readonly assistant: ChatAssistant,
    private readonly ids: IdGenerator,
  ) {}

  async execute(cmd: SendMessageCommand): Promise<Result<ConversationDto, DomainError>> {
    const content = cmd.content.trim();
    if (content.length === 0) return err(new EmptyMessageError());

    const { conversation, isNew } = await this.resolveConversation(cmd);

    conversation.addUserMessage(content);

    let reply: string;
    try {
      reply = await this.assistant.reply(conversation.history());
    } catch {
      // Persist the user's message even if the assistant failed, so it isn't lost.
      await this.persist(conversation, isNew);
      return err(new AssistantUnavailableError());
    }

    conversation.addAssistantMessage(reply);
    await this.persist(conversation, isNew);

    return ok(ConversationMapper.toDto(conversation));
  }

  private async resolveConversation(
    cmd: SendMessageCommand,
  ): Promise<{ conversation: Conversation; isNew: boolean }> {
    if (cmd.conversationId) {
      const existing = await this.conversations.findById(cmd.conversationId);
      if (existing) return { conversation: existing, isNew: false };
    }
    return {
      conversation: Conversation.start(this.ids.generate(), cmd.ownerId),
      isNew: true,
    };
  }

  private async persist(conversation: Conversation, isNew: boolean): Promise<void> {
    if (isNew) await this.conversations.save(conversation);
    else await this.conversations.update(conversation);
  }
}
