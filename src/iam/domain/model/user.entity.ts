import { Entity } from '@/shared/domain/entity';
import { UserId } from '../value-objects/user-id.vo';
import { EmailAddress } from '../value-objects/email-address.vo';
import { FullName } from '../value-objects/full-name.vo';
import { Nickname } from '../value-objects/nickname.vo';
import { PasswordCredential } from '../value-objects/password-credential.vo';
import type { UserRole } from '../value-objects/user-role.vo';

export interface UserProps {
  name: FullName;
  email: EmailAddress;
  credential: PasswordCredential;
  role: UserRole;
  nickname: Nickname | null;
  avatarUrl: string;
  phone: string;
  district: string;
  createdAt: Date;
}

/**
 * User — aggregate root of the IAM context.
 *
 * State changes go through intention-revealing methods (rename, changeNickname,
 * setCredential…) instead of public setters, so the entity always stays
 * consistent and the business rules live here, not in the UI or the store.
 */
export class User extends Entity<UserId> {
  private constructor(id: UserId, private props: UserProps) {
    super(id);
  }

  /** Reconstitutes a User from already-valid parts (e.g. loaded from the DB). */
  static rehydrate(id: UserId, props: UserProps): User {
    return new User(id, props);
  }

  /** Creates a brand-new User (used by sign-up). */
  static register(id: UserId, props: UserProps): User {
    return new User(id, props);
  }

  // ---- read accessors ----
  get name(): FullName { return this.props.name; }
  get email(): EmailAddress { return this.props.email; }
  get credential(): PasswordCredential { return this.props.credential; }
  get role(): UserRole { return this.props.role; }
  get nickname(): Nickname | null { return this.props.nickname; }
  get avatarUrl(): string { return this.props.avatarUrl; }
  get phone(): string { return this.props.phone; }
  get district(): string { return this.props.district; }
  get createdAt(): Date { return this.props.createdAt; }

  /** Name shown across the UI: nickname if set, otherwise the real name. */
  get displayName(): string {
    return this.props.nickname?.toString() ?? this.props.name.toString();
  }

  // ---- behavior ----
  rename(name: FullName): void { this.props.name = name; }
  changeEmail(email: EmailAddress): void { this.props.email = email; }
  changeNickname(nickname: Nickname | null): void { this.props.nickname = nickname; }
  changePhone(phone: string): void { this.props.phone = phone.trim(); }
  changeDistrict(district: string): void { this.props.district = district.trim(); }
  changeAvatar(url: string): void { this.props.avatarUrl = url; }
  setCredential(credential: PasswordCredential): void { this.props.credential = credential; }
}
