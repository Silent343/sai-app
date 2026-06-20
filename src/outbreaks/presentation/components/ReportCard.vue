<script setup lang="ts">
import type { OutbreakReportDto } from '../../application/dto/outbreak-report.dto';

const props = defineProps<{ report: OutbreakReportDto }>();

const date = new Date(props.report.reportedAt).toLocaleDateString('es-PE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const initial = (props.report.reporterName || '?').charAt(0).toUpperCase();
</script>

<template>
  <article class="report">
    <header class="report__head">
      <span class="report__avatar">
        <img v-if="report.reporterAvatar" :src="report.reporterAvatar" alt="" />
        <span v-else>{{ initial }}</span>
      </span>
      <div>
        <p class="report__name">{{ report.reporterName }}</p>
        <p class="report__date">{{ date }}</p>
      </div>
      <span class="report__district">{{ report.district }}</span>
    </header>
    <p class="report__disease">{{ report.disease }}</p>
    <p class="report__desc">{{ report.description }}</p>
  </article>
</template>

<style scoped>
.report {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r-md); padding: 1rem; box-shadow: var(--shadow-sm);
}
.report__head { display: flex; align-items: center; gap: 0.6rem; }
.report__avatar {
  width: 36px; height: 36px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
  display: grid; place-items: center; background: var(--primary-soft);
  color: var(--primary-deep); font: 700 0.9rem var(--font-display);
}
.report__avatar img { width: 100%; height: 100%; object-fit: cover; }
.report__name { margin: 0; font-weight: 600; font-size: 0.9rem; color: var(--ink); }
.report__date { margin: 0; font-size: 0.74rem; color: var(--muted); }
.report__district {
  margin-left: auto; font-size: 0.72rem; font-weight: 600;
  padding: 0.25rem 0.6rem; border-radius: 999px;
  background: var(--surface-3); color: var(--ink-soft);
}
.report__disease {
  margin: 0.8rem 0 0.3rem; font: 600 1rem var(--font-display); color: var(--primary-deep);
}
.report__desc { margin: 0; color: var(--muted); line-height: 1.55; font-size: 0.9rem; }
</style>
