import type { User } from '../model/user.entity';

/**
 * TokenProvider — issues the session token returned on sign-in/sign-up.
 * In this demo the implementation is local; in production it would be replaced
 * by a backend-issued JWT without changing any use case.
 */
export interface TokenProvider {
  issue(user: User): Promise<string>;
}
