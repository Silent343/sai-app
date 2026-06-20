/**
 * ChatAssistant port (domain service).
 *
 * The domain expresses *what* it needs — given a conversation history, produce
 * the assistant's next reply — without knowing *how*. The concrete adapter
 * (Gemini, Claude, a fake for tests) lives in infrastructure and is injected at
 * the composition root. This keeps the AI provider a detail, not a dependency.
 */
export interface AssistantTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatAssistant {
  /** Returns the assistant's reply to the given ordered history. */
  reply(history: AssistantTurn[]): Promise<string>;
}
