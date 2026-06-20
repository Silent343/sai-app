import type { PasswordHasher } from '../../domain/services/password-hasher';
import type { PlainPassword } from '../../domain/value-objects/plain-password.vo';
import { PasswordCredential } from '../../domain/value-objects/password-credential.vo';

/**
 * Demo PasswordHasher using the Web Crypto API: hash = SHA-256(salt + ":" + password).
 *
 * NOTE: A browser-side hash is a stand-in so the json-server demo is self-contained.
 * In production this port would be implemented on the backend with bcrypt/argon2;
 * no use case would change, only this adapter — that is the point of the port.
 */
export class WebCryptoPasswordHasher implements PasswordHasher {
  async hash(plain: PlainPassword): Promise<PasswordCredential> {
    const salt = this.randomSalt();
    const hash = await this.digest(salt, plain.reveal());
    return PasswordCredential.fromHash(hash, salt);
  }

  async verify(plain: PlainPassword, credential: PasswordCredential): Promise<boolean> {
    const hash = await this.digest(credential.salt, plain.reveal());
    return this.constantTimeEquals(hash, credential.hash);
  }

  private async digest(salt: string, password: string): Promise<string> {
    const bytes = new TextEncoder().encode(`${salt}:${password}`);
    const buffer = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private randomSalt(): string {
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  private constantTimeEquals(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
  }
}
