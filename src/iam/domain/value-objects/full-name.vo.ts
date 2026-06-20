import { ValueObject } from '@/shared/domain/value-object';
import { ok, err, type Result } from '@/shared/domain/result';
import { EmptyNameError } from '../errors/iam.errors';

/** A non-empty display name. */
export class FullName extends ValueObject<string> {
  private constructor(value: string) { super(value); }

  static create(raw: string): Result<FullName, EmptyNameError> {
    const trimmed = raw.trim().replace(/\s+/g, ' ');
    if (trimmed.length === 0) return err(new EmptyNameError());
    return ok(new FullName(trimmed));
  }

  toString(): string { return this.value; }
}
