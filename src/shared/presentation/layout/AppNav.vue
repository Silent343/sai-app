<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/iam/presentation/stores/auth.store';

const auth = useAuthStore();

const links = [
  { to: '/chat', label: 'Asistente', icon: 'chat' },
  { to: '/mapa', label: 'Mapa', icon: 'map' },
  { to: '/videos', label: 'Videos', icon: 'play' },
] as const;
</script>

<template>
  <header class="appnav">
    <RouterLink to="/chat" class="appnav__brand">
      <svg viewBox="0 0 64 64" width="26" height="26" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="var(--primary)" />
        <path d="M8 34 h12 l4 -10 l6 18 l5 -22 l4 14 h12" fill="none" stroke="#bff3ee"
              stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <span>SAI</span>
    </RouterLink>

    <nav class="appnav__links">
      <RouterLink v-for="l in links" :key="l.to" :to="l.to" class="appnav__link">
        <svg v-if="l.icon === 'chat'" viewBox="0 0 24 24" class="ic" aria-hidden="true"><path d="M4 5h16v11H7l-3 3z" /></svg>
        <svg v-else-if="l.icon === 'map'" viewBox="0 0 24 24" class="ic" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z M9 4v14 M15 6v14" /></svg>
        <svg v-else viewBox="0 0 24 24" class="ic" aria-hidden="true"><path d="M7 5v14l11-7z" /></svg>
        <span>{{ l.label }}</span>
      </RouterLink>
    </nav>

    <RouterLink to="/perfil" class="appnav__user">
      <span class="appnav__avatar">
        <img v-if="auth.currentUser?.avatarUrl" :src="auth.currentUser.avatarUrl" alt="" />
        <span v-else>{{ (auth.currentUser?.displayName ?? '?').charAt(0).toUpperCase() }}</span>
      </span>
      <span class="appnav__name">{{ auth.currentUser?.displayName }}</span>
    </RouterLink>
  </header>
</template>

<style scoped>
.appnav {
  display: flex; align-items: center; gap: 1.5rem;
  padding: 0.7rem 1.4rem;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}
.appnav__brand {
  display: flex; align-items: center; gap: 0.5rem;
  font: 700 1.1rem var(--font-display); letter-spacing: 0.1em; color: var(--ink);
}
.appnav__links { display: flex; gap: 0.3rem; margin-left: 0.5rem; }
.appnav__link {
  display: flex; align-items: center; gap: 0.45rem;
  padding: 0.5rem 0.85rem; border-radius: var(--r-sm);
  color: var(--muted); font-weight: 600; font-size: 0.9rem;
  transition: background 0.15s var(--ease), color 0.15s var(--ease);
}
.appnav__link:hover { background: var(--surface-3); color: var(--ink-soft); }
.appnav__link.router-link-active { background: var(--primary-soft); color: var(--primary-deep); }
.ic { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linejoin: round; stroke-linecap: round; }

.appnav__user {
  display: flex; align-items: center; gap: 0.6rem; margin-left: auto;
  padding: 0.3rem 0.5rem 0.3rem 0.3rem; border-radius: 999px;
  border: 1px solid var(--border); color: var(--ink-soft); font-weight: 600; font-size: 0.9rem;
  transition: border-color 0.15s var(--ease);
}
.appnav__user:hover { border-color: var(--border-strong); }
.appnav__avatar {
  width: 30px; height: 30px; border-radius: 50%; overflow: hidden;
  display: grid; place-items: center;
  background: var(--primary); color: #fff; font: 700 0.85rem var(--font-display);
}
.appnav__avatar img { width: 100%; height: 100%; object-fit: cover; }

@media (max-width: 640px) {
  .appnav__name { display: none; }
  .appnav__link span:last-child { display: none; }
}
</style>
