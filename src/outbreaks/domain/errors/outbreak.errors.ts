import { DomainError } from '@/shared/domain/domain-error';

export class InvalidDistrictError extends DomainError {
  readonly code = 'OUTBREAK.INVALID_DISTRICT';
  constructor() { super('El distrito seleccionado no es válido.'); }
}

export class EmptyReportError extends DomainError {
  readonly code = 'OUTBREAK.EMPTY_REPORT';
  constructor() { super('La enfermedad y la descripción son obligatorias.'); }
}
