import type { UseCase } from '@/shared/application/use-case';
import { ok, err, type Result } from '@/shared/domain/result';
import type { DomainError } from '@/shared/domain/domain-error';

import type { UserRepository } from '../../domain/repositories/user.repository';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { UserNotFoundError } from '../../domain/errors/iam.errors';

export class DeleteAccountUseCase implements UseCase<string, Result<void, DomainError>> {
  constructor(private readonly users: UserRepository) {}

  async execute(userId: string): Promise<Result<void, DomainError>> {
    const id = UserId.of(userId);
    const user = await this.users.findById(id);
    if (!user) return err(new UserNotFoundError());
    await this.users.delete(id);
    return ok(undefined);
  }
}
