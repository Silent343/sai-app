<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import AppNav from '@/shared/presentation/layout/AppNav.vue';
import { useToast } from '@/shared/presentation/toast/use-toast';
import { useOutbreaksStore } from '../stores/outbreaks.store';
import { COVERED_DISTRICTS } from '../../domain/model/district.vo';
import ReportCard from '../components/ReportCard.vue';

const store = useOutbreaksStore();
const toast = useToast();

const MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15605.948528720959!2d-77.10183978626675!3d-12.078767477840286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c964223bb347%3A0x2013e50c7a7d23d4!2sSan%20Miguel!5e0!3m2!1ses!2spe!4v1717034296464!5m2!1ses!2spe';

const form = reactive({ district: COVERED_DISTRICTS[0] as string, disease: '', description: '' });
const showForm = ref(false);

onMounted(() => store.loadReports());

async function submit(): Promise<void> {
  const error = await store.report({ ...form });
  if (error) {
    toast.error(error);
    return;
  }
  toast.success('Reporte publicado.');
  form.disease = '';
  form.description = '';
  showForm.value = false;
}
</script>

<template>
  <div class="page">
    <AppNav />

    <main class="map">
      <header class="map__head">
        <div>
          <h1>Datos por distrito</h1>
          <p>Reportes comunitarios de enfermedades infecciosas en Lima.</p>
        </div>
        <button class="btn btn--primary" @click="showForm = !showForm">
          {{ showForm ? 'Cerrar' : 'Añadir reporte' }}
        </button>
      </header>

      <section v-if="showForm" class="form-card">
        <div class="grid">
          <label class="field">
            <span class="field__label">Distrito</span>
            <select v-model="form.district" class="input">
              <option v-for="d in COVERED_DISTRICTS" :key="d" :value="d">{{ d }}</option>
            </select>
          </label>
          <label class="field">
            <span class="field__label">Enfermedad</span>
            <input v-model="form.disease" class="input" placeholder="Ej. Dengue" />
          </label>
        </div>
        <label class="field">
          <span class="field__label">Descripción</span>
          <textarea
            v-model="form.description"
            class="input"
            rows="3"
            placeholder="Describe el brote o la situación observada…"
          ></textarea>
        </label>
        <div class="form-card__actions">
          <button class="btn btn--primary" :disabled="store.isSaving" @click="submit">
            {{ store.isSaving ? 'Publicando…' : 'Publicar reporte' }}
          </button>
        </div>
      </section>

      <div class="map__grid">
        <div class="map__frame">
          <iframe
            :src="MAP_EMBED"
            title="Mapa de Lima"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div class="map__reports">
          <p v-if="store.isLoading" class="muted">Cargando reportes…</p>
          <p v-else-if="store.reports.length === 0" class="muted">
            Aún no hay reportes. Sé el primero en publicar uno.
          </p>
          <ReportCard v-for="r in store.reports" :key="r.id" :report="r" />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page { min-height: 100vh; }
.map { max-width: 70rem; margin: 0 auto; padding: 2rem 1.5rem; }
.map__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.map__head h1 { font-size: 1.5rem; }
.map__head p { color: var(--muted); margin: 0.4rem 0 0; }

.form-card {
  margin-top: 1.4rem; padding: 1.2rem; background: var(--surface);
  border: 1px solid var(--border); border-radius: var(--r-lg); display: grid; gap: 0.9rem;
}
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
.form-card__actions { display: flex; justify-content: flex-end; }

.map__grid { margin-top: 1.6rem; display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr); gap: 1.4rem; }
.map__frame {
  border-radius: var(--r-lg); overflow: hidden; border: 1px solid var(--border);
  box-shadow: var(--shadow-md); min-height: 420px;
}
.map__frame iframe { width: 100%; height: 100%; min-height: 420px; border: 0; display: block; }
.map__reports { display: flex; flex-direction: column; gap: 0.8rem; max-height: 70vh; overflow-y: auto; }
.muted { color: var(--muted); }

@media (max-width: 860px) {
  .map__grid { grid-template-columns: 1fr; }
  .grid { grid-template-columns: 1fr; }
}
</style>
