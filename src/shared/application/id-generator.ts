/** Port for generating unique identifiers (UUIDs). Implemented in infrastructure. */
export interface IdGenerator {
  generate(): string;
}
