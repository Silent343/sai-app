import { ValueObject } from '@/shared/domain/value-object';

/** Identity of a User. Wraps a UUID string. */
export class UserId extends ValueObject<string> {
  private constructor(value: string) { super(value); }

  static of(value: string): UserId {
    return new UserId(value);
  }

  toString(): string { return this.value; }
}
