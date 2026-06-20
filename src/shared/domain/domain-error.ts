/**
 * Base class for every expected, business-level error.
 * `code` is a stable machine-readable identifier; `message` is human-facing.
 */
export abstract class DomainError {
  abstract readonly code: string;
  protected constructor(public readonly message: string) {}
}
