import { AxiosHttpClient } from '@/shared/infrastructure/http/axios-http-client';
import { TOKEN_STORAGE_KEY } from '@/iam/infrastructure/di/iam.container';

import { VideoGuideApiRepository } from '../persistence/video-guide-api.repository';
import { ListVideosUseCase } from '../../application/use-cases/list-videos.use-case';

/** Composition root for the Library bounded context. */
function buildLibraryContainer() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const http = new AxiosHttpClient(baseURL, () => localStorage.getItem(TOKEN_STORAGE_KEY));

  const videos = new VideoGuideApiRepository(http);

  return {
    listVideos: new ListVideosUseCase(videos),
  } as const;
}

export type LibraryContainer = ReturnType<typeof buildLibraryContainer>;

export const library: LibraryContainer = buildLibraryContainer();
