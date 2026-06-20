import type { ValueObject } from './value-object';

/**
 * Base Entity. Entities have identity: two entities are equal iff their ids are
 * equal, regardless of their other attributes. The id is a ValueObject.
 */
export abstract class Entity<TId extends ValueObject<unknown>> {
  protected constructor(protected readonly _id: TId) {}

  get id(): TId {
    return this._id;
  }

  equals(other?: Entity<TId>): boolean {
    if (other === undefined || other === null) return false;
    if (this === other) return true;
    return this._id.equals(other._id);
  }
}
