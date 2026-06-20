import type { UseCase } from '@/shared/application/use-case';
import type { IdGenerator } from '@/shared/application/id-generator';
import { ok, err, type Result } from '@/shared/domain/result';
import type { DomainError } from '@/shared/domain/domain-error';

import type { UserRepository } from '../../domain/repositories/user.repository';
import type { PasswordHasher } from '../../domain/services/password-hasher';
import type { TokenProvider } from '../../domain/services/token-provider';

import { User } from '../../domain/model/user.entity';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { EmailAddress } from '../../domain/value-objects/email-address.vo';
import { FullName } from '../../domain/value-objects/full-name.vo';
import { PlainPassword } from '../../domain/value-objects/plain-password.vo';
import { WeakPasswordError, EmailAlreadyInUseError } from '../../domain/errors/iam.errors';

import type { SignUpCommand } from '../dto/sign-up.command';
import type { AuthResultDto } from '../dto/user.dto';
import { UserMapper } from '../mappers/user.mapper';

export class SignUpUseCase implements UseCase<SignUpCommand, Result<AuthResultDto, DomainError>> {
  constructor(
    private readonly users: UserRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokens: TokenProvider,
    private readonly ids: IdGenerator,
  ) {}

  async execute(cmd: SignUpCommand): Promise<Result<AuthResultDto, DomainError>> {
    const name = FullName.create(cmd.name);
    if (name.isErr()) return err(name.error);

    const email = EmailAddress.create(cmd.email);
    if (email.isErr()) return err(email.error);

    const password = PlainPassword.create(cmd.password);
    if (password.isErr()) return err(password.error);

    if (cmd.password !== cmd.confirmPassword) {
      return err(new WeakPasswordError('Las contraseñas no coinciden.'));
    }

    if (await this.users.existsByEmail(email.value)) {
      return err(new EmailAlreadyInUseError(email.value.toString()));
    }

    const credential = await this.hasher.hash(password.value);

    const user = User.register(UserId.of(this.ids.generate()), {
      name: name.value,
      email: email.value,
      credential,
      role: 'patient',
      nickname: null,
      avatarUrl: '',
      phone: '',
      district: '',
      createdAt: new Date(),
    });

    await this.users.save(user);
    const token = await this.tokens.issue(user);
    return ok({ user: UserMapper.toDto(user), token });
  }
}
