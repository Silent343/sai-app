/** Roles allowed inside the IAM context. */
export const USER_ROLES = ['patient', 'specialist', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value);
}
