import { createRouter, createWebHistory } from 'vue-router';
import { requireAuth, redirectIfAuthenticated } from '@/iam/presentation/guards/auth.guard';

declare module 'vue-router' {
  interface RouteMeta {
    /** Route requires an authenticated session. */
    requiresAuth?: boolean;
    /** Route is only for anonymous visitors (auth screens). */
    guestOnly?: boolean;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    // No landing page: the app opens straight into the assistant. Anonymous
    // visitors are bounced to /login by the auth guard.
    { path: '/', redirect: '/chat' },

    {
      path: '/login',
      name: 'sign-in',
      meta: { guestOnly: true },
      component: () => import('@/iam/presentation/pages/SignInPage.vue'),
    },
    {
      path: '/registro',
      name: 'sign-up',
      meta: { guestOnly: true },
      component: () => import('@/iam/presentation/pages/SignUpPage.vue'),
    },

    // ---- Assistant (core) ----
    {
      path: '/chat',
      name: 'chat',
      meta: { requiresAuth: true },
      component: () => import('@/assistant/presentation/pages/ChatPage.vue'),
    },

    // ---- Outbreaks (community reports + map) ----
    {
      path: '/mapa',
      name: 'map',
      meta: { requiresAuth: true },
      component: () => import('@/outbreaks/presentation/pages/MapPage.vue'),
    },

    // ---- Library (recommended videos) ----
    {
      path: '/videos',
      name: 'videos',
      meta: { requiresAuth: true },
      component: () => import('@/library/presentation/pages/VideosPage.vue'),
    },

    // ---- IAM profile ----
    {
      path: '/perfil',
      name: 'profile',
      meta: { requiresAuth: true },
      component: () => import('@/iam/presentation/pages/ProfilePage.vue'),
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/shared/presentation/NotFoundPage.vue'),
    },
  ],
});

// Global navigation guards (order matters: auth gate first, then guest gate).
router.beforeEach(requireAuth);
router.beforeEach(redirectIfAuthenticated);

export default router;
