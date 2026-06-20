import type { UseCase } from '@/shared/application/use-case';
import { ok, err, type Result } from '@/shared/domain/result';
import type { DomainError } from '@/shared/domain/domain-error';

import type { UserRepository } from '../../domain/repositories/user.repository';
import type { PasswordHasher } from '../../domain/services/password-hasher';
import type { TokenProvider } from '../../domain/services/token-provider';

import { EmailAddress } from '../../domain/value-objects/email-address.vo';
import { PlainPassword } from '../../domain/value-objects/plain-password.vo';
import { InvalidCredentialsError } from '../../domain/errors/iam.errors';

import type { SignInCommand } from '../dto/sign-in.command';
import type { AuthResultDto } from '../dto/user.dto';
import { UserMapper } from '../mappers/user.mapper';

export class SignInUseCase implements UseCase<SignInCommand, Result<AuthResultDto, DomainError>> {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenProvider,
  ) {}

  async execute(cmd: SignInCommand): Promise<Result<AuthResultDto, DomainError>> {
    const email = EmailAddress.create(cmd.email);
    // A malformed email is just a failed login attempt — don't leak the reason.
    if (email.isErr()) return err(new InvalidCredentialsError());

    const user = await this.users.findByEmail(email.value);
    if (!user) return err(new InvalidCredentialsError());

    const attempt = PlainPassword.forVerification(cmd.password);
    const matches = await this.hasher.verify(attempt, user.credential);
    if (!matches) return err(new InvalidCredentialsError());

    const token = await this.tokens.issue(user);
    return ok({ user: UserMapper.toDto(user), token });
  }
}
