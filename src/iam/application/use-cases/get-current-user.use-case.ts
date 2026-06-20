import type { UseCase } from '@/shared/application/use-case';
import { ok, err, type Result } from '@/shared/domain/result';
import type { DomainError } from '@/shared/domain/domain-error';

import type { UserRepository } from '../../domain/repositories/user.repository';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { UserNotFoundError } from '../../domain/errors/iam.errors';

import type { UserDto } from '../dto/user.dto';
import { UserMapper } from '../mappers/user.mapper';

export class GetCurrentUserUseCase implements UseCase<string, Result<UserDto, DomainError>> {
  constructor(private readonly users: UserRepository) {}

  async execute(userId: string): Promise<Result<UserDto, DomainError>> {
    const user = await this.users.findById(UserId.of(userId));
    if (!user) return err(new UserNotFoundError());
    return ok(UserMapper.toDto(user));
  }
}
