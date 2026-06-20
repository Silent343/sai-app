<script setup lang="ts">
import { useAuthStore } from '@/iam/presentation/stores/auth.store';
const auth = useAuthStore();
</script>

<template>
  <div class="home">
    <header class="nav">
      <div class="nav__brand">
        <svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="var(--primary)" />
          <path d="M8 34 h12 l4 -10 l6 18 l5 -22 l4 14 h12" fill="none" stroke="#bff3ee" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>SAI</span>
      </div>
      <nav class="nav__links">
        <template v-if="auth.isAuthenticated">
          <RouterLink to="/perfil" class="btn btn--ghost">{{ auth.currentUser?.displayName }}</RouterLink>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn btn--ghost">Iniciar sesión</RouterLink>
          <RouterLink to="/registro" class="btn btn--primary">Crear cuenta</RouterLink>
        </template>
      </nav>
    </header>

    <main class="hero">
      <div class="hero__copy">
        <p class="eyebrow">Asistencia inteligente en salud</p>
        <h1>Orientación temprana frente a enfermedades infecciosas.</h1>
        <p class="hero__lead">
          SAI te acompaña con un pre-diagnóstico orientativo, reportes por distrito en Lima y
          un perfil donde gestionas tu información de forma segura.
        </p>
        <div class="hero__cta">
          <RouterLink :to="auth.isAuthenticated ? '/perfil' : '/registro'" class="btn btn--primary">
            {{ auth.isAuthenticated ? 'Ir a mi perfil' : 'Empezar gratis' }}
          </RouterLink>
          <RouterLink to="/login" class="btn btn--ghost">Ya tengo cuenta</RouterLink>
        </div>
      </div>

      <aside class="hero__card">
        <div class="vital">
          <div class="vital__row"><span>Reportes activos</span><strong>128</strong></div>
          <div class="vital__row"><span>Distritos cubiertos</span><strong>6</strong></div>
          <div class="vital__row"><span>Tiempo de respuesta</span><strong class="mono">~2.4s</strong></div>
        </div>
        <svg class="vital__ecg" viewBox="0 0 320 50" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 25 H60 l7 -16 l9 32 l8 -38 l7 22 H150 l7 -12 l9 24 l8 -30 l7 18 H320"
                fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </aside>
    </main>

    <footer class="foot">
      <span>SAI · Sistema de Asistencia Inteligente</span>
      <span class="mono">v1.0 · DDD + Clean Architecture</span>
    </footer>
  </div>
</template>

<style scoped>
.home { min-height: 100vh; display: flex; flex-direction: column; }
.nav {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.1rem 2rem; border-bottom: 1px solid var(--border); background: var(--surface);
}
.nav__brand { display: flex; align-items: center; gap: 0.55rem; font: 700 1.2rem var(--font-display); letter-spacing: 0.1em; color: var(--ink); }
.nav__links { display: flex; gap: 0.7rem; }

.hero {
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
  gap: 3rem;
  align-items: center;
  max-width: 64rem;
  width: 100%;
  margin: 0 auto;
  padding: 4rem 2rem;
}
.hero__copy h1 { font-size: clamp(2rem, 4vw, 3rem); margin-top: 0.6rem; max-width: 16ch; }
.hero__lead { margin-top: 1.2rem; color: var(--muted); line-height: 1.6; max-width: 46ch; }
.hero__cta { margin-top: 2rem; display: flex; gap: 0.8rem; flex-wrap: wrap; }

.hero__card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-lg);
  padding: 1.6rem;
}
.vital { display: grid; gap: 0.9rem; }
.vital__row {
  display: flex; align-items: baseline; justify-content: space-between;
  padding-bottom: 0.9rem; border-bottom: 1px dashed var(--border);
}
.vital__row span { color: var(--muted); font-size: 0.86rem; }
.vital__row strong { font: 600 1.4rem var(--font-display); color: var(--primary-deep); }
.vital__ecg { width: 100%; height: 50px; margin-top: 1.2rem; }

.foot {
  display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap;
  padding: 1.2rem 2rem; border-top: 1px solid var(--border);
  font-size: 0.78rem; color: var(--muted);
}
@media (max-width: 820px) {
  .hero { grid-template-columns: 1fr; gap: 2rem; padding: 3rem 1.5rem; }
}
</style>
