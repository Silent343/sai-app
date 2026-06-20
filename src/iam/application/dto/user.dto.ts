import type { UserRole } from '../../domain/value-objects/user-role.vo';

/** Read model of a User exposed to the presentation layer. No domain types leak out. */
export interface UserDto {
  id: string;
  name: string;
  email: string;
  displayName: string;
  nickname: string | null;
  role: UserRole;
  avatarUrl: string;
  phone: string;
  district: string;
  createdAt: string;
}

/** Result of a successful authentication. */
export interface AuthResultDto {
  user: UserDto;
  token: string;
}
