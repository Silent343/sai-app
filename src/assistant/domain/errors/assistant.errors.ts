import { DomainError } from '@/shared/domain/domain-error';

/** The user tried to send an empty message to the assistant. */
export class EmptyMessageError extends DomainError {
  readonly code = 'ASSISTANT.EMPTY_MESSAGE';
  constructor() { super('El mensaje no puede estar vacío.'); }
}

/** The assistant backend could not produce a reply. */
export class AssistantUnavailableError extends DomainError {
  readonly code = 'ASSISTANT.UNAVAILABLE';
  constructor() { super('El asistente no está disponible en este momento. Inténtalo de nuevo.'); }
}

/** A referenced conversation does not exist. */
export class ConversationNotFoundError extends DomainError {
  readonly code = 'ASSISTANT.CONVERSATION_NOT_FOUND';
  constructor() { super('No se encontró la conversación.'); }
}
