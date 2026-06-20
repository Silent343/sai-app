import type { TokenProvider } from '../../domain/services/token-provider';
import type { User } from '../../domain/model/user.entity';

/**
 * Demo TokenProvider that builds a self-contained base64 token carrying the
 * user id and issue time. Replaceable by a backend-issued JWT without touching
 * any use case.
 */
export class LocalTokenProvider implements TokenProvider {
  async issue(user: User): Promise<string> {
    const payload = {
      sub: user.id.toString(),
      name: user.displayName,
      iat: Date.now(),
    };
    const json = JSON.stringify(payload);
    // btoa over UTF-8 safe encoding.
    const b64 = btoa(String.fromCharCode(...new TextEncoder().encode(json)));
    return `sai.${b64}`;
  }
}
