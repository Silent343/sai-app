import type { User } from '../../domain/model/user.entity';
import type { UserDto } from '../dto/user.dto';

/** Translates the User aggregate into its read DTO. */
export class UserMapper {
  static toDto(user: User): UserDto {
    return {
      id: user.id.toString(),
      name: user.name.toString(),
      email: user.email.toString(),
      displayName: user.displayName,
      nickname: user.nickname?.toString() ?? null,
      role: user.role,
      avatarUrl: user.avatarUrl,
      phone: user.phone,
      district: user.district,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
