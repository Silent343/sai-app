import { defineStore } from 'pinia';
import { iam, TOKEN_STORAGE_KEY, SESSION_USER_KEY } from '../../infrastructure/di/iam.container';
import type { UserDto } from '../../application/dto/user.dto';
import type { SignInCommand } from '../../application/dto/sign-in.command';
import type { SignUpCommand } from '../../application/dto/sign-up.command';
import type { UpdateProfileCommand } from '../../application/dto/update-profile.command';
import type { ChangePasswordCommand } from '../../application/dto/change-password.command';

type ActionStatus = 'idle' | 'loading';

interface AuthState {
  user: UserDto | null;
  token: string | null;
  status: ActionStatus;
}

/**
 * Auth store — the presentation layer's entry point to the IAM use cases.
 * It holds session state and persists it, but contains no business rules:
 * every decision is delegated to a use case. Actions resolve to a human-facing
 * error message (string) or null on success, which pages render directly.
 */
export const useAuthStore = defineStore('iam-auth', {
  state: (): AuthState => ({
    user: readJson<UserDto>(SESSION_USER_KEY),
    token: localStorage.getItem(TOKEN_STORAGE_KEY),
    status: 'idle',
  }),

  getters: {
    isAuthenticated: (state): boolean => Boolean(state.token && state.user),
    currentUser: (state): UserDto | null => state.user,
    isBusy: (state): boolean => state.status === 'loading',
  },

  actions: {
    async signIn(command: SignInCommand): Promise<string | null> {
      this.status = 'loading';
      try {
        const result = await iam.signIn.execute(command);
        if (result.isErr()) return result.error.message;
        this.persistSession(result.value.user, result.value.token);
        return null;
      } finally {
        this.status = 'idle';
      }
    },

    async signUp(command: SignUpCommand): Promise<string | null> {
      this.status = 'loading';
      try {
        const result = await iam.signUp.execute(command);
        if (result.isErr()) return result.error.message;
        this.persistSession(result.value.user, result.value.token);
        return null;
      } finally {
        this.status = 'idle';
      }
    },

    async refreshUser(): Promise<void> {
      if (!this.user) return;
      const result = await iam.getCurrentUser.execute(this.user.id);
      if (result.isOk()) this.setUser(result.value);
    },

    async updateProfile(command: UpdateProfileCommand): Promise<string | null> {
      this.status = 'loading';
      try {
        const result = await iam.updateProfile.execute(command);
        if (result.isErr()) return result.error.message;
        this.setUser(result.value);
        return null;
      } finally {
        this.status = 'idle';
      }
    },

    async changePassword(command: ChangePasswordCommand): Promise<string | null> {
      this.status = 'loading';
      try {
        const result = await iam.changePassword.execute(command);
        return result.isErr() ? result.error.message : null;
      } finally {
        this.status = 'idle';
      }
    },

    async deleteAccount(): Promise<string | null> {
      if (!this.user) return null;
      this.status = 'loading';
      try {
        const result = await iam.deleteAccount.execute(this.user.id);
        if (result.isErr()) return result.error.message;
        this.signOut();
        return null;
      } finally {
        this.status = 'idle';
      }
    },

    signOut(): void {
      this.user = null;
      this.token = null;
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(SESSION_USER_KEY);
    },

    // ---- internal helpers ----
    persistSession(user: UserDto, token: string): void {
      this.token = token;
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      this.setUser(user);
    },

    setUser(user: UserDto): void {
      this.user = user;
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(user));
    },
  },
});

function readJson<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
