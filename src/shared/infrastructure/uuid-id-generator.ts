import type { IdGenerator } from '@/shared/application/id-generator';

/** IdGenerator backed by the Web Crypto UUID v4 generator. */
export class UuidIdGenerator implements IdGenerator {
  generate(): string {
    return crypto.randomUUID();
  }
}
