<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useToast } from '@/shared/presentation/toast/use-toast';
import ProfileSidebar, { type ProfileTab } from '../components/ProfileSidebar.vue';
import PasswordField from '../components/PasswordField.vue';

const auth = useAuthStore();
const router = useRouter();
const toast = useToast();

const tabs: ProfileTab[] = [
  { key: 'general', label: 'Perfil', hint: 'Datos y foto' },
  { key: 'security', label: 'Seguridad', hint: 'Contraseña' },
  { key: 'account', label: 'Cuenta', hint: 'Sesión y datos' },
];
const active = ref<string>('general');

const profile = reactive({
  name: '', email: '', nickname: '', phone: '', district: '', avatarUrl: '',
});
const security = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' });

const districts = ['San Miguel', 'San Isidro', 'Miraflores', 'Magdalena', 'Comas', 'Ate'];

const initials = computed(() =>
  (profile.nickname || profile.name || 'SAI')
    .split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase(),
);
const memberSince = computed(() =>
  auth.currentUser ? new Date(auth.currentUser.createdAt).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' }) : '—',
);

onMounted(async () => {
  await auth.refreshUser();
  hydrate();
});

function hydrate(): void {
  const u = auth.currentUser;
  if (!u) return;
  profile.name = u.name;
  profile.email = u.email;
  profile.nickname = u.nickname ?? '';
  profile.phone = u.phone;
  profile.district = u.district;
  profile.avatarUrl = u.avatarUrl;
}

function onAvatarPick(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { profile.avatarUrl = reader.result as string; };
  reader.readAsDataURL(file);
}
function clearAvatar(): void { profile.avatarUrl = ''; }

async function saveProfile(): Promise<void> {
  if (!auth.currentUser) return;
  const error = await auth.updateProfile({ userId: auth.currentUser.id, ...profile });
  error ? toast.error(error) : toast.success('Cambios guardados');
}

async function savePassword(): Promise<void> {
  if (!auth.currentUser) return;
  const error = await auth.changePassword({ userId: auth.currentUser.id, ...security });
  if (error) { toast.error(error); return; }
  toast.success('Contraseña actualizada');
  security.currentPassword = security.newPassword = security.confirmPassword = '';
}

function signOut(): void {
  auth.signOut();
  toast.info('Sesión cerrada');
  router.push('/login');
}

async function removeAccount(): Promise<void> {
  if (!window.confirm('Esto eliminará tu cuenta de forma permanente. ¿Continuar?')) return;
  const error = await auth.deleteAccount();
  if (error) { toast.error(error); return; }
  toast.info('Tu cuenta fue eliminada');
  router.push('/registro');
}
</script>

<template>
  <div class="shell">
    <header class="topbar">
      <RouterLink to="/" class="topbar__brand">
        <svg viewBox="0 0 64 64" width="26" height="26" aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="var(--primary)" />
          <path d="M8 34 h12 l4 -10 l6 18 l5 -22 l4 14 h12" fill="none" stroke="#bff3ee" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>SAI</span>
      </RouterLink>
      <div class="topbar__user">
        <span class="topbar__name">{{ auth.currentUser?.displayName }}</span>
        <button class="btn btn--ghost" @click="signOut">Cerrar sesión</button>
      </div>
    </header>

    <main class="layout">
      <div class="layout__head">
        <p class="eyebrow">Mi cuenta</p>
        <h1>Configuración de perfil</h1>
        <p class="layout__sub">Administra tu información, seguridad y sesión.</p>
      </div>

      <div class="layout__grid">
        <ProfileSidebar :tabs="tabs" :active="active" @select="active = $event" />

        <section class="panel">
          <!-- ============ GENERAL ============ -->
          <div v-show="active === 'general'" class="pane">
            <div class="pane__head">
              <h2>Información personal</h2>
              <p>Esta información se muestra en tu perfil dentro de SAI.</p>
            </div>

            <div class="avatar-row">
              <div class="avatar">
                <img v-if="profile.avatarUrl" :src="profile.avatarUrl" alt="Foto de perfil" />
                <span v-else>{{ initials }}</span>
              </div>
              <div class="avatar-actions">
                <label class="btn btn--ghost">
                  Subir foto
                  <input type="file" accept="image/*" hidden @change="onAvatarPick" />
                </label>
                <button v-if="profile.avatarUrl" class="btn btn--danger" @click="clearAvatar">Quitar</button>
                <p class="avatar-hint">PNG o JPG. Se guarda con tus cambios.</p>
              </div>
            </div>

            <div class="grid-2">
              <div class="field">
                <label class="field__label" for="p-name">Nombre completo</label>
                <input id="p-name" v-model="profile.name" class="input" type="text" />
              </div>
              <div class="field">
                <label class="field__label" for="p-nick">Apodo</label>
                <input id="p-nick" v-model="profile.nickname" class="input" type="text" placeholder="Opcional" />
              </div>
              <div class="field">
                <label class="field__label" for="p-email">Correo electrónico</label>
                <input id="p-email" v-model="profile.email" class="input" type="email" />
              </div>
              <div class="field">
                <label class="field__label" for="p-phone">Teléfono</label>
                <input id="p-phone" v-model="profile.phone" class="input" type="tel" placeholder="+51 …" />
              </div>
              <div class="field">
                <label class="field__label" for="p-dist">Distrito</label>
                <select id="p-dist" v-model="profile.district" class="input">
                  <option value="">Selecciona…</option>
                  <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
                </select>
              </div>
            </div>

            <div class="pane__foot">
              <button class="btn btn--primary" :disabled="auth.isBusy" @click="saveProfile">
                {{ auth.isBusy ? 'Guardando…' : 'Guardar cambios' }}
              </button>
            </div>
          </div>

          <!-- ============ SECURITY ============ -->
          <div v-show="active === 'security'" class="pane">
            <div class="pane__head">
              <h2>Seguridad</h2>
              <p>Cambia tu contraseña. Necesitas confirmar la actual.</p>
            </div>

            <div class="grid-1">
              <PasswordField id="s-cur" v-model="security.currentPassword" label="Contraseña actual" />
              <PasswordField id="s-new" v-model="security.newPassword" label="Nueva contraseña" show-strength />
              <PasswordField id="s-cnf" v-model="security.confirmPassword" label="Repite la nueva contraseña" />
            </div>

            <div class="pane__foot">
              <button class="btn btn--primary" :disabled="auth.isBusy" @click="savePassword">
                {{ auth.isBusy ? 'Actualizando…' : 'Actualizar contraseña' }}
              </button>
            </div>
          </div>

          <!-- ============ ACCOUNT ============ -->
          <div v-show="active === 'account'" class="pane">
            <div class="pane__head">
              <h2>Detalles de la cuenta</h2>
              <p>Identificador, rol y fecha de registro.</p>
            </div>

            <dl class="meta">
              <div><dt>Identificador</dt><dd class="mono">{{ auth.currentUser?.id }}</dd></div>
              <div><dt>Rol</dt><dd>{{ auth.currentUser?.role }}</dd></div>
              <div><dt>Miembro desde</dt><dd>{{ memberSince }}</dd></div>
            </dl>

            <div class="danger">
              <div>
                <h3>Eliminar cuenta</h3>
                <p>Se borrarán todos tus datos de forma permanente.</p>
              </div>
              <button class="btn btn--danger" :disabled="auth.isBusy" @click="removeAccount">Eliminar cuenta</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.shell { min-height: 100vh; background: var(--surface-2); }
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.6rem;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}
.topbar__brand { display: flex; align-items: center; gap: 0.5rem; font: 700 1.1rem var(--font-display); letter-spacing: 0.1em; color: var(--ink); }
.topbar__user { display: flex; align-items: center; gap: 0.9rem; }
.topbar__name { font-size: 0.9rem; color: var(--ink-soft); font-weight: 500; }

.layout { max-width: 60rem; margin: 0 auto; padding: 2.4rem 1.6rem 4rem; }
.layout__head h1 { font-size: 1.8rem; margin-top: 0.35rem; }
.layout__sub { color: var(--muted); margin-top: 0.4rem; }
.layout__grid {
  margin-top: 1.8rem;
  display: grid;
  grid-template-columns: 15rem minmax(0, 1fr);
  gap: 1.6rem;
}
.panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}
.pane { padding: 1.8rem; }
.pane__head { margin-bottom: 1.4rem; }
.pane__head h2 { font-size: 1.25rem; }
.pane__head p { color: var(--muted); margin-top: 0.35rem; font-size: 0.9rem; }
.pane__foot { margin-top: 1.6rem; }

.avatar-row { display: flex; align-items: center; gap: 1.2rem; margin-bottom: 1.6rem; }
.avatar {
  width: 76px; height: 76px;
  border-radius: 50%;
  display: grid; place-items: center;
  background: var(--primary-soft);
  color: var(--primary-deep);
  font: 600 1.4rem var(--font-display);
  overflow: hidden;
  border: 1px solid #bfe3e2;
  flex-shrink: 0;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-actions { display: flex; flex-wrap: wrap; gap: 0.6rem; align-items: center; }
.avatar-actions .btn { cursor: pointer; }
.avatar-hint { width: 100%; font-size: 0.76rem; color: var(--muted); margin: 0.2rem 0 0; }

.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.grid-1 { display: grid; gap: 1rem; max-width: 24rem; }

.meta { display: grid; gap: 0.9rem; margin: 0 0 1.8rem; }
.meta div { display: grid; gap: 0.2rem; }
.meta dt { font-size: 0.76rem; color: var(--muted); letter-spacing: 0.02em; }
.meta dd { margin: 0; font-size: 0.92rem; color: var(--ink); }

.danger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 1.2rem;
  border: 1px solid #f1c7c2;
  background: var(--danger-soft);
  border-radius: var(--r-md);
}
.danger h3 { font-size: 1rem; color: var(--danger); }
.danger p { margin: 0.25rem 0 0; font-size: 0.84rem; color: #8a3a30; }

@media (max-width: 760px) {
  .layout__grid { grid-template-columns: 1fr; }
  .grid-2 { grid-template-columns: 1fr; }
  .danger { flex-direction: column; align-items: flex-start; }
}
</style>
