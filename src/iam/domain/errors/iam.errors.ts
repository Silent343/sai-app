import { DomainError } from '@/shared/domain/domain-error';

export class InvalidEmailError extends DomainError {
  readonly code = 'IAM.INVALID_EMAIL';
  constructor(raw: string) { super(`El correo "${raw}" no es válido.`); }
}

export class WeakPasswordError extends DomainError {
  readonly code = 'IAM.WEAK_PASSWORD';
  constructor(reason: string) { super(reason); }
}

export class EmptyNameError extends DomainError {
  readonly code = 'IAM.EMPTY_NAME';
  constructor() { super('El nombre no puede estar vacío.'); }
}

export class InvalidNicknameError extends DomainError {
  readonly code = 'IAM.INVALID_NICKNAME';
  constructor() { super('El apodo debe tener entre 2 y 20 caracteres.'); }
}

export class EmailAlreadyInUseError extends DomainError {
  readonly code = 'IAM.EMAIL_IN_USE';
  constructor(email: string) { super(`Ya existe una cuenta registrada con ${email}.`); }
}

export class InvalidCredentialsError extends DomainError {
  readonly code = 'IAM.INVALID_CREDENTIALS';
  constructor() { super('Correo o contraseña incorrectos.'); }
}

export class UserNotFoundError extends DomainError {
  readonly code = 'IAM.USER_NOT_FOUND';
  constructor() { super('No se encontró la cuenta solicitada.'); }
}

export class IncorrectCurrentPasswordError extends DomainError {
  readonly code = 'IAM.INCORRECT_CURRENT_PASSWORD';
  constructor() { super('La contraseña actual no coincide.'); }
}
