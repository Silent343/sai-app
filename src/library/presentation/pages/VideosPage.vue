<script setup lang="ts">
import { onMounted } from 'vue';
import AppNav from '@/shared/presentation/layout/AppNav.vue';
import { useLibraryStore } from '../stores/library.store';

const store = useLibraryStore();
onMounted(() => store.loadVideos());
</script>

<template>
  <div class="page">
    <AppNav />

    <main class="videos">
      <header class="videos__head">
        <h1>Guías sobre enfermedades infecciosas</h1>
        <p>Material recomendado para prevención y orientación.</p>
      </header>

      <p v-if="store.isLoading" class="muted">Cargando videos…</p>

      <div v-else class="videos__grid">
        <article v-for="v in store.videos" :key="v.id" class="vcard">
          <div class="vcard__frame">
            <iframe
              :src="v.embedUrl"
              :title="v.title"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
          <div class="vcard__body">
            <span class="vcard__topic">{{ v.topic }}</span>
            <h2 class="vcard__title">{{ v.title }}</h2>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; }
.videos { max-width: 70rem; margin: 0 auto; padding: 2rem 1.5rem; }
.videos__head h1 { font-size: 1.5rem; }
.videos__head p { color: var(--muted); margin: 0.4rem 0 0; }
.muted { color: var(--muted); margin-top: 1.5rem; }

.videos__grid {
  margin-top: 1.8rem; display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr)); gap: 1.4rem;
}
.vcard {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--shadow-sm);
}
.vcard__frame { position: relative; aspect-ratio: 16 / 9; background: #000; }
.vcard__frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.vcard__body { padding: 0.9rem 1rem 1.1rem; }
.vcard__topic {
  font: 600 0.68rem var(--font-body); letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--primary);
}
.vcard__title { font-size: 1rem; margin-top: 0.35rem; }
</style>
