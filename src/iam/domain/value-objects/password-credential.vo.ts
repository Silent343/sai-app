import { ValueObject } from '@/shared/domain/value-object';

interface CredentialProps {
  readonly hash: string;
  readonly salt: string;
}

/**
 * The persisted form of a password: a hash and its salt. This is what lives on
 * the User entity and in the database. The plain text is never part of it.
 */
export class PasswordCredential extends ValueObject<CredentialProps> {
  private constructor(props: CredentialProps) { super(props); }

  static fromHash(hash: string, salt: string): PasswordCredential {
    return new PasswordCredential({ hash, salt });
  }

  get hash(): string { return this.value.hash; }
  get salt(): string { return this.value.salt; }
}
