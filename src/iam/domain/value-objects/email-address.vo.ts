import { ValueObject } from '@/shared/domain/value-object';
import { ok, err, type Result } from '@/shared/domain/result';
import { InvalidEmailError } from '../errors/iam.errors';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A syntactically valid, normalized (lower-cased, trimmed) email address. */
export class EmailAddress extends ValueObject<string> {
  private constructor(value: string) { super(value); }

  static create(raw: string): Result<EmailAddress, InvalidEmailError> {
    const normalized = raw.trim().toLowerCase();
    if (!EMAIL_RE.test(normalized)) return err(new InvalidEmailError(raw));
    return ok(new EmailAddress(normalized));
  }

  toString(): string { return this.value; }
}
