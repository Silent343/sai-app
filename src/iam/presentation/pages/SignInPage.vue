<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useToast } from '@/shared/presentation/toast/use-toast';
import AuthShell from '../components/AuthShell.vue';
import PasswordField from '../components/PasswordField.vue';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();
const toast = useToast();

const form = reactive({ email: '', password: '' });
const formError = ref('');

async function submit(): Promise<void> {
  formError.value = '';
  const error = await auth.signIn({ email: form.email, password: form.password });
  if (error) {
    formError.value = error;
    return;
  }
  toast.success(`Bienvenido, ${auth.currentUser?.displayName ?? ''}`);
  const redirect = (route.query.redirect as string) || '/chat';
  await router.push(redirect);
}
</script>

<template>
  <AuthShell
    headline="Tu salud, mejor acompañada."
    sub="Accede para consultar pre-diagnósticos, revisar reportes por distrito y gestionar tu cuenta."
  >
    <p class="eyebrow">Acceso</p>
    <h2 class="card-title">Inicia sesión</h2>
    <p class="card-sub">¿Aún no tienes cuenta? <RouterLink to="/registro">Crea una aquí</RouterLink>.</p>

    <form class="form" @submit.prevent="submit">
      <div class="field">
        <label class="field__label" for="email">Correo electrónico</label>
        <input id="email" v-model="form.email" class="input" type="email" placeholder="tu@correo.com" autocomplete="username" />
      </div>

      <PasswordField id="password" v-model="form.password" label="Contraseña" />

      <p v-if="formError" class="banner banner--error">{{ formError }}</p>

      <button class="btn btn--primary btn--block" type="submit" :disabled="auth.isBusy">
        {{ auth.isBusy ? 'Verificando…' : 'Entrar' }}
      </button>
    </form>

    <p class="demo-hint">
      Demo: <span class="mono">gabriel@sai.pe</span> · <span class="mono">Sai12345!</span>
    </p>
  </AuthShell>
</template>

<style scoped>
.card-title { font-size: 1.6rem; margin-top: 0.35rem; }
.card-sub { margin: 0.5rem 0 1.6rem; color: var(--muted); font-size: 0.9rem; }
.form { display: grid; gap: 1.05rem; }
.banner { margin: 0; padding: 0.7rem 0.85rem; border-radius: var(--r-sm); font-size: 0.85rem; }
.banner--error { background: var(--danger-soft); color: var(--danger); border: 1px solid #f1c7c2; }
.demo-hint {
  margin-top: 1.4rem;
  font-size: 0.78rem;
  color: var(--muted);
  text-align: center;
}
</style>
