import type { User } from '../model/user.entity';
import type { UserId } from '../value-objects/user-id.vo';
import type { EmailAddress } from '../value-objects/email-address.vo';

/**
 * UserRepository — persistence port for the User aggregate.
 * Declared in the domain, implemented in infrastructure (Dependency Inversion).
 * Speaks only the domain language; it knows nothing about HTTP or json-server.
 */
export interface UserRepository {
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: EmailAddress): Promise<User | null>;
  existsByEmail(email: EmailAddress): Promise<boolean>;
  save(user: User): Promise<void>;
  update(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
}
