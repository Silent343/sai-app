import { User } from '../../domain/model/user.entity';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { EmailAddress } from '../../domain/value-objects/email-address.vo';
import { FullName } from '../../domain/value-objects/full-name.vo';
import { Nickname } from '../../domain/value-objects/nickname.vo';
import { PasswordCredential } from '../../domain/value-objects/password-credential.vo';
import { isUserRole, type UserRole } from '../../domain/value-objects/user-role.vo';

/** Raw row shape stored in db.json / returned by json-server. */
export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  nickname: string;
  role: string;
  avatarUrl: string;
  phone: string;
  district: string;
  createdAt: string;
}

/**
 * Assembler between the persistence record and the User aggregate.
 * Keeps the mapping in one place so the repository stays thin and the domain
 * never sees raw JSON.
 */
export class UserAssembler {
  static toDomain(record: UserRecord): User {
    const name = FullName.create(record.name);
    const email = EmailAddress.create(record.email);
    if (name.isErr() || email.isErr()) {
      throw new Error(`Corrupt user record ${record.id}: invalid name/email.`);
    }

    let nickname: Nickname | null = null;
    if (record.nickname && record.nickname.trim().length > 0) {
      const parsed = Nickname.create(record.nickname);
      nickname = parsed.isOk() ? parsed.value : null;
    }

    const role: UserRole = isUserRole(record.role) ? record.role : 'patient';

    return User.rehydrate(UserId.of(record.id), {
      name: name.value,
      email: email.value,
      credential: PasswordCredential.fromHash(record.passwordHash, record.passwordSalt),
      role,
      nickname,
      avatarUrl: record.avatarUrl ?? '',
      phone: record.phone ?? '',
      district: record.district ?? '',
      createdAt: new Date(record.createdAt),
    });
  }

  static toRecord(user: User): UserRecord {
    return {
      id: user.id.toString(),
      name: user.name.toString(),
      email: user.email.toString(),
      passwordHash: user.credential.hash,
      passwordSalt: user.credential.salt,
      nickname: user.nickname?.toString() ?? '',
      role: user.role,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
      district: user.district,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
