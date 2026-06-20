<script setup lang="ts">
defineProps<{ headline: string; sub: string }>();
</script>

<template>
  <aside class="brand">
    <div class="brand__top">
      <div class="brand__logo">
        <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="rgba(255,255,255,0.12)" />
          <path d="M8 34 h12 l4 -10 l6 18 l5 -22 l4 14 h12" fill="none"
                stroke="#bff3ee" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="brand__wordmark">SAI</span>
      </div>
      <p class="brand__kicker">Sistema de Asistencia Inteligente</p>
    </div>

    <div class="brand__body">
      <h1 class="brand__headline">{{ headline }}</h1>
      <p class="brand__sub">{{ sub }}</p>

      <!-- Signature element: an ECG trace that ties the brand to its medical world -->
      <div class="ecg" aria-hidden="true">
        <svg viewBox="0 0 420 60" preserveAspectRatio="none">
          <path class="ecg__line"
            d="M0 30 H70 l8 -18 l10 36 l9 -44 l8 26 H160 l8 -14 l10 28 l9 -34 l8 20 H300 l8 -18 l10 36 l9 -44 l8 26 H420" />
        </svg>
      </div>
    </div>

    <ul class="brand__points">
      <li><span>◇</span> Pre-diagnóstico orientativo de enfermedades infecciosas</li>
      <li><span>◇</span> Mapa de reportes por distrito en Lima</li>
      <li><span>◇</span> Tus datos cifrados y bajo tu control</li>
    </ul>
  </aside>
</template>

<style scoped>
.brand {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  padding: 2.6rem;
  color: #eaf6f6;
  background:
    radial-gradient(120% 120% at 0% 0%, rgba(47, 163, 155, 0.4), transparent 55%),
    linear-gradient(160deg, var(--primary-deep) 0%, #073b41 100%);
  overflow: hidden;
}
.brand::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 22px 22px;
  opacity: 0.5;
  pointer-events: none;
}
.brand__logo { display: flex; align-items: center; gap: 0.7rem; }
.brand__wordmark {
  font: 700 1.5rem var(--font-display);
  letter-spacing: 0.12em;
  color: #fff;
}
.brand__kicker {
  margin: 0.7rem 0 0;
  font-size: 0.8rem;
  letter-spacing: 0.04em;
  color: rgba(234, 246, 246, 0.7);
}
.brand__body { position: relative; z-index: 1; }
.brand__headline {
  font-size: clamp(1.8rem, 2.4vw, 2.4rem);
  color: #fff;
  max-width: 16ch;
}
.brand__sub {
  margin-top: 0.9rem;
  max-width: 34ch;
  line-height: 1.55;
  color: rgba(234, 246, 246, 0.78);
}
.ecg { margin-top: 1.8rem; height: 60px; }
.ecg svg { width: 100%; height: 100%; }
.ecg__line {
  fill: none;
  stroke: #6fe0d4;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 0 4px rgba(111, 224, 212, 0.5));
  stroke-dasharray: 900;
  stroke-dashoffset: 900;
  animation: trace 3.6s var(--ease) infinite;
}
@keyframes trace {
  0% { stroke-dashoffset: 900; }
  60% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: 0; opacity: 0.55; }
}
.brand__points {
  position: relative;
  z-index: 1;
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.7rem;
  font-size: 0.86rem;
  color: rgba(234, 246, 246, 0.82);
}
.brand__points span { color: var(--accent); margin-right: 0.5rem; }

@media (max-width: 880px) {
  .brand { padding: 2rem; }
  .ecg { display: none; }
  .brand__points { display: none; }
}
</style>
