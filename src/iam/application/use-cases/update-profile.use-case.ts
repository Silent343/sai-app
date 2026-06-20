import type { UseCase } from '@/shared/application/use-case';
import { ok, err, type Result } from '@/shared/domain/result';
import type { DomainError } from '@/shared/domain/domain-error';

import type { UserRepository } from '../../domain/repositories/user.repository';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { EmailAddress } from '../../domain/value-objects/email-address.vo';
import { FullName } from '../../domain/value-objects/full-name.vo';
import { Nickname } from '../../domain/value-objects/nickname.vo';
import { UserNotFoundError, EmailAlreadyInUseError } from '../../domain/errors/iam.errors';

import type { UpdateProfileCommand } from '../dto/update-profile.command';
import type { UserDto } from '../dto/user.dto';
import { UserMapper } from '../mappers/user.mapper';

export class UpdateProfileUseCase implements UseCase<UpdateProfileCommand, Result<UserDto, DomainError>> {
  constructor(private readonly users: UserRepository) {}

  async execute(cmd: UpdateProfileCommand): Promise<Result<UserDto, DomainError>> {
    const user = await this.users.findById(UserId.of(cmd.userId));
    if (!user) return err(new UserNotFoundError());

    const name = FullName.create(cmd.name);
    if (name.isErr()) return err(name.error);

    const email = EmailAddress.create(cmd.email);
    if (email.isErr()) return err(email.error);

    // Nickname is optional: empty clears it.
    let nickname: Nickname | null = null;
    if (cmd.nickname.trim().length > 0) {
      const parsed = Nickname.create(cmd.nickname);
      if (parsed.isErr()) return err(parsed.error);
      nickname = parsed.value;
    }

    // Only check uniqueness if the email actually changed.
    if (!email.value.equals(user.email) && (await this.users.existsByEmail(email.value))) {
      return err(new EmailAlreadyInUseError(email.value.toString()));
    }

    user.rename(name.value);
    user.changeEmail(email.value);
    user.changeNickname(nickname);
    user.changePhone(cmd.phone);
    user.changeDistrict(cmd.district);
    user.changeAvatar(cmd.avatarUrl);

    await this.users.update(user);
    return ok(UserMapper.toDto(user));
  }
}
