import type { UseCase } from '@/shared/application/use-case';
import { ok, err, type Result } from '@/shared/domain/result';
import type { DomainError } from '@/shared/domain/domain-error';

import type { UserRepository } from '../../domain/repositories/user.repository';
import type { PasswordHasher } from '../../domain/services/password-hasher';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { PlainPassword } from '../../domain/value-objects/plain-password.vo';
import {
  UserNotFoundError,
  IncorrectCurrentPasswordError,
  WeakPasswordError,
} from '../../domain/errors/iam.errors';

import type { ChangePasswordCommand } from '../dto/change-password.command';

export class ChangePasswordUseCase implements UseCase<ChangePasswordCommand, Result<void, DomainError>> {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(cmd: ChangePasswordCommand): Promise<Result<void, DomainError>> {
    const user = await this.users.findById(UserId.of(cmd.userId));
    if (!user) return err(new UserNotFoundError());

    const current = PlainPassword.forVerification(cmd.currentPassword);
    if (!(await this.hasher.verify(current, user.credential))) {
      return err(new IncorrectCurrentPasswordError());
    }

    const next = PlainPassword.create(cmd.newPassword);
    if (next.isErr()) return err(next.error);

    if (cmd.newPassword !== cmd.confirmPassword) {
      return err(new WeakPasswordError('Las contraseñas no coinciden.'));
    }

    user.setCredential(await this.hasher.hash(next.value));
    await this.users.update(user);
    return ok(undefined);
  }
}
