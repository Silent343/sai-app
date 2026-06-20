/**
 * Result<T, E>
 * A lightweight Either type. The whole domain and application layer return
 * Result instead of throwing, so the flow of expected errors (invalid email,
 * wrong password, etc.) is explicit and type-safe. Only truly exceptional
 * situations (network down, bug) use exceptions.
 */
export type Result<T, E> = Ok<T, E> | Err<T, E>;

export class Ok<T, E> {
  readonly _tag = 'Ok' as const;
  constructor(public readonly value: T) {}
  isOk(): this is Ok<T, E> { return true; }
  isErr(): this is Err<T, E> { return false; }
}

export class Err<T, E> {
  readonly _tag = 'Err' as const;
  constructor(public readonly error: E) {}
  isOk(): this is Ok<T, E> { return false; }
  isErr(): this is Err<T, E> { return true; }
}

export const ok = <T, E = never>(value: T): Result<T, E> => new Ok(value);
export const err = <E, T = never>(error: E): Result<T, E> => new Err(error);

/** Collects a list of Results into a single Result of a list (fails on first error). */
export function combine<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const values: T[] = [];
  for (const r of results) {
    if (r.isErr()) return err(r.error);
    values.push(r.value);
  }
  return ok(values);
}
