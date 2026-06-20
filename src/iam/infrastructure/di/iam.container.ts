import { AxiosHttpClient } from '@/shared/infrastructure/http/axios-http-client';
import { UuidIdGenerator } from '@/shared/infrastructure/uuid-id-generator';

import { UserApiRepository } from '../persistence/user-api.repository';
import { WebCryptoPasswordHasher } from '../security/web-crypto-password-hasher';
import { LocalTokenProvider } from '../security/local-token-provider';

import { SignUpUseCase } from '../../application/use-cases/sign-up.use-case';
import { SignInUseCase } from '../../application/use-cases/sign-in.use-case';
import { GetCurrentUserUseCase } from '../../application/use-cases/get-current-user.use-case';
import { UpdateProfileUseCase } from '../../application/use-cases/update-profile.use-case';
import { ChangePasswordUseCase } from '../../application/use-cases/change-password.use-case';
import { DeleteAccountUseCase } from '../../application/use-cases/delete-account.use-case';

export const TOKEN_STORAGE_KEY = 'sai.token';
export const SESSION_USER_KEY = 'sai.user';

/**
 * Composition root for the IAM bounded context.
 *
 * This is the only place where concrete implementations are chosen and wired to
 * the ports. Every other layer depends on abstractions, so swapping json-server
 * for a real API — or the demo hasher for a backend one — happens here alone.
 * (Sign-out is pure presentation state and needs no use case.)
 */
function buildIamContainer() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const http = new AxiosHttpClient(baseURL, () => localStorage.getItem(TOKEN_STORAGE_KEY));

  // Adapters (port implementations)
  const userRepository = new UserApiRepository(http);
  const passwordHasher = new WebCryptoPasswordHasher();
  const tokenProvider = new LocalTokenProvider();
  const idGenerator = new UuidIdGenerator();

  // Use cases (application services)
  return {
    signUp: new SignUpUseCase(userRepository, passwordHasher, tokenProvider, idGenerator),
    signIn: new SignInUseCase(userRepository, passwordHasher, tokenProvider),
    getCurrentUser: new GetCurrentUserUseCase(userRepository),
    updateProfile: new UpdateProfileUseCase(userRepository),
    changePassword: new ChangePasswordUseCase(userRepository, passwordHasher),
    deleteAccount: new DeleteAccountUseCase(userRepository),
  } as const;
}

export type IamContainer = ReturnType<typeof buildIamContainer>;

/** Singleton container for the running app. */
export const iam: IamContainer = buildIamContainer();
