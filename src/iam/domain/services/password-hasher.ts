import type { PlainPassword } from '../value-objects/plain-password.vo';
import type { PasswordCredential } from '../value-objects/password-credential.vo';

/**
 * PasswordHasher — domain service port. Hashing is a policy detail (algorithm,
 * salt) the domain should not hard-code, so it is abstracted here and provided
 * by infrastructure.
 */
export interface PasswordHasher {
  hash(plain: PlainPassword): Promise<PasswordCredential>;
  verify(plain: PlainPassword, credential: PasswordCredential): Promise<boolean>;
}
