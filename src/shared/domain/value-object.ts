/**
 * Base ValueObject. Value objects are immutable and compared by value, never
 * by identity. Subclasses wrap a validated primitive (or struct) and expose it
 * through `value`. Construction goes through a static factory that returns a
 * Result, so an invalid value object can never exist.
 */
export abstract class ValueObject<T> {
  protected constructor(protected readonly props: T) {
    Object.freeze(this.props);
  }

  get value(): T {
    return this.props;
  }

  equals(other?: ValueObject<T>): boolean {
    if (other === undefined || other === null) return false;
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }
}
