import { defineStore } from 'pinia';
import { library } from '../../infrastructure/di/library.container';
import type { VideoGuideDto } from '../../application/dto/video-guide.dto';

interface LibraryState {
  videos: VideoGuideDto[];
  status: 'idle' | 'loading';
}

export const useLibraryStore = defineStore('library', {
  state: (): LibraryState => ({ videos: [], status: 'idle' }),

  getters: {
    isLoading: (state): boolean => state.status === 'loading',
  },

  actions: {
    async loadVideos(): Promise<void> {
      this.status = 'loading';
      try {
        const result = await library.listVideos.execute();
        if (result.isOk()) this.videos = result.value;
      } finally {
        this.status = 'idle';
      }
    },
  },
});
