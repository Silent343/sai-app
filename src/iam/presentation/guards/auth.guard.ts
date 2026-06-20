import type { NavigationGuardWithThis } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

/** Blocks routes marked `meta.requiresAuth` for anonymous visitors. */
export const requireAuth: NavigationGuardWithThis<undefined> = (to) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'sign-in', query: { redirect: to.fullPath } };
  }
  return true;
};

/** Keeps already-authenticated users away from the auth screens. */
export const redirectIfAuthenticated: NavigationGuardWithThis<undefined> = (to) => {
  const auth = useAuthStore();
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'chat' };
  }
  return true;
};
