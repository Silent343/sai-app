import { ValueObject } from '@/shared/domain/value-object';
import { ok, err, type Result } from '@/shared/domain/result';
import { InvalidDistrictError } from '../errors/outbreak.errors';

/** Districts covered by SAI in Lima. Centralized so UI and domain agree. */
export const COVERED_DISTRICTS = [
  'San Miguel',
  'San Isidro',
  'Miraflores',
  'Magdalena',
  'Comas',
  'Ate',
] as const;

export type DistrictName = (typeof COVERED_DISTRICTS)[number];

export function isCoveredDistrict(value: string): value is DistrictName {
  return (COVERED_DISTRICTS as readonly string[]).includes(value);
}

/** A Lima district within SAI's coverage area. */
export class District extends ValueObject<DistrictName> {
  private constructor(value: DistrictName) {
    super(value);
  }

  static create(value: string): Result<District, InvalidDistrictError> {
    const trimmed = value.trim();
    if (!isCoveredDistrict(trimmed)) return err(new InvalidDistrictError());
    return ok(new District(trimmed));
  }

  toString(): string {
    return this.value;
  }
}
