<script setup lang="ts">
import AuthBrandPanel from './AuthBrandPanel.vue';
defineProps<{ headline: string; sub: string }>();
</script>

<template>
  <div class="auth">
    <AuthBrandPanel :headline="headline" :sub="sub" />
    <main class="auth__main">
      <div class="auth__card">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.auth {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
}
.auth__main {
  display: grid;
  place-items: center;
  padding: 2rem;
  background: var(--surface-2);
}
.auth__card { width: 100%; max-width: 26rem; }
@media (max-width: 880px) {
  .auth { grid-template-columns: 1fr; }
}
</style>
