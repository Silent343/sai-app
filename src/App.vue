<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppToast from '@/shared/presentation/toast/AppToast.vue';
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="route" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
  <AppToast />
</template>

<style>
.route-enter-active,
.route-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.route-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.route-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
@media (prefers-reduced-motion: reduce) {
  .route-enter-active,
  .route-leave-active {
    transition: none;
  }
}
</style>
