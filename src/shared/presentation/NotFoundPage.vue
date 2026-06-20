<script setup lang="ts"></script>

<template>
  <div class="nf">
    <p class="eyebrow">Error 404</p>
    <h1>Esta página no existe</h1>
    <p class="nf__sub">La ruta que buscas no está disponible o fue movida.</p>
    <RouterLink to="/" class="btn btn--primary">Volver al inicio</RouterLink>
  </div>
</template>

<style scoped>
.nf {
  min-height: 100vh;
  display: grid;
  place-content: center;
  justify-items: center;
  text-align: center;
  gap: 0.6rem;
  padding: 2rem;
}
.nf h1 { font-size: 2rem; }
.nf__sub { color: var(--muted); margin-bottom: 0.8rem; }
</style>
