import { ValueObject } from '@/shared/domain/value-object';
import { ok, err, type Result } from '@/shared/domain/result';
import { WeakPasswordError } from '../errors/iam.errors';

/**
 * A raw password provided by the user. It is transient: it never gets stored.
 * Use cases hash it into a PasswordCredential and discard it.
 */
export class PlainPassword extends ValueObject<string> {
  private constructor(value: string) { super(value); }

  /** Builds a password that must satisfy the strength policy (sign-up, change). */
  static create(raw: string): Result<PlainPassword, WeakPasswordError> {
    if (raw.length < 8) {
      return err(new WeakPasswordError('La contraseña debe tener al menos 8 caracteres.'));
    }
    if (!/[A-Za-z]/.test(raw) || !/[0-9]/.test(raw)) {
      return err(new WeakPasswordError('La contraseña debe combinar letras y números.'));
    }
    return ok(new PlainPassword(raw));
  }

  /**
   * Builds a password WITHOUT applying the policy. Used only to verify an
   * already-stored credential at sign-in, where an old or weak password must
   * still be checkable (and fail as InvalidCredentials, not WeakPassword).
   */
  static forVerification(raw: string): PlainPassword {
    return new PlainPassword(raw);
  }

  /** Exposed only to the PasswordHasher; never serialized. */
  reveal(): string { return this.value; }
}
