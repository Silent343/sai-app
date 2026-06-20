<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useToast } from '@/shared/presentation/toast/use-toast';
import AuthShell from '../components/AuthShell.vue';
import PasswordField from '../components/PasswordField.vue';

const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

const form = reactive({ name: '', email: '', password: '', confirmPassword: '' });
const formError = ref('');

async function submit(): Promise<void> {
  formError.value = '';
  const error = await auth.signUp({ ...form });
  if (error) {
    formError.value = error;
    return;
  }
  toast.success('Cuenta creada. ¡Bienvenido a SAI!');
  await router.push('/chat');
}
</script>

<template>
  <AuthShell
    headline="Crea tu cuenta en SAI."
    sub="Regístrate para guardar tu historial, personalizar tu perfil y recibir orientación de salud."
  >
    <p class="eyebrow">Registro</p>
    <h2 class="card-title">Crear cuenta</h2>
    <p class="card-sub">¿Ya tienes cuenta? <RouterLink to="/login">Inicia sesión</RouterLink>.</p>

    <form class="form" @submit.prevent="submit">
      <div class="field">
        <label class="field__label" for="name">Nombre completo</label>
        <input id="name" v-model="form.name" class="input" type="text" placeholder="Ej. Gabriel Quispe" autocomplete="name" />
      </div>

      <div class="field">
        <label class="field__label" for="email">Correo electrónico</label>
        <input id="email" v-model="form.email" class="input" type="email" placeholder="tu@correo.com" autocomplete="username" />
      </div>

      <PasswordField id="password" v-model="form.password" label="Contraseña" show-strength />
      <PasswordField id="confirm" v-model="form.confirmPassword" label="Repite la contraseña" />

      <p v-if="formError" class="banner banner--error">{{ formError }}</p>

      <button class="btn btn--primary btn--block" type="submit" :disabled="auth.isBusy">
        {{ auth.isBusy ? 'Creando cuenta…' : 'Crear cuenta' }}
      </button>
    </form>
  </AuthShell>
</template>

<style scoped>
.card-title { font-size: 1.6rem; margin-top: 0.35rem; }
.card-sub { margin: 0.5rem 0 1.6rem; color: var(--muted); font-size: 0.9rem; }
.form { display: grid; gap: 1rem; }
.banner { margin: 0; padding: 0.7rem 0.85rem; border-radius: var(--r-sm); font-size: 0.85rem; }
.banner--error { background: var(--danger-soft); color: var(--danger); border: 1px solid #f1c7c2; }
</style>
