import { ValueObject } from '@/shared/domain/value-object';
import { ok, err, type Result } from '@/shared/domain/result';
import { InvalidNicknameError } from '../errors/iam.errors';

/** An optional display alias (2–20 chars). */
export class Nickname extends ValueObject<string> {
  private constructor(value: string) { super(value); }

  static create(raw: string): Result<Nickname, InvalidNicknameError> {
    const trimmed = raw.trim();
    if (trimmed.length < 2 || trimmed.length > 20) return err(new InvalidNicknameError());
    return ok(new Nickname(trimmed));
  }

  toString(): string { return this.value; }
}
