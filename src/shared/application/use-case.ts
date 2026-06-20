/**
 * A UseCase encapsulates one application-level operation (one user intention).
 * Single Responsibility: one use case = one reason to change.
 * Input/Output are explicit types; execution is always async.
 */
export interface UseCase<TInput, TOutput> {
  execute(input: TInput): Promise<TOutput>;
}
