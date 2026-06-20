import type { HttpClient } from '@/shared/infrastructure/http/http-client';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { User } from '../../domain/model/user.entity';
import type { UserId } from '../../domain/value-objects/user-id.vo';
import type { EmailAddress } from '../../domain/value-objects/email-address.vo';
import { UserAssembler, type UserRecord } from './user.record';

/**
 * REST adapter for the UserRepository port, backed by json-server.
 * Exercises the full CRUD surface over /users:
 *   GET /users/:id, GET /users?email=, POST /users, PATCH /users/:id, DELETE /users/:id
 */
export class UserApiRepository implements UserRepository {
  private readonly resource = '/users';

  constructor(private readonly http: HttpClient) {}

  async findById(id: UserId): Promise<User | null> {
    try {
      const record = await this.http.get<UserRecord>(`${this.resource}/${id.toString()}`);
      return UserAssembler.toDomain(record);
    } catch {
      return null;
    }
  }

  async findByEmail(email: EmailAddress): Promise<User | null> {
    const matches = await this.http.get<UserRecord[]>(this.resource, { email: email.toString() });
    const record = matches[0];
    return record ? UserAssembler.toDomain(record) : null;
  }

  async existsByEmail(email: EmailAddress): Promise<boolean> {
    const matches = await this.http.get<UserRecord[]>(this.resource, { email: email.toString() });
    return matches.length > 0;
  }

  async save(user: User): Promise<void> {
    await this.http.post<UserRecord>(this.resource, UserAssembler.toRecord(user));
  }

  async update(user: User): Promise<void> {
    await this.http.patch<UserRecord>(`${this.resource}/${user.id.toString()}`, UserAssembler.toRecord(user));
  }

  async delete(id: UserId): Promise<void> {
    await this.http.delete(`${this.resource}/${id.toString()}`);
  }
}
