import { defineStore } from 'pinia';
import { outbreaks } from '../../infrastructure/di/outbreaks.container';
import { useAuthStore } from '@/iam/presentation/stores/auth.store';
import type {
  OutbreakReportDto,
  ReportOutbreakCommand,
} from '../../application/dto/outbreak-report.dto';

interface OutbreaksState {
  reports: OutbreakReportDto[];
  status: 'idle' | 'loading' | 'saving';
}

export const useOutbreaksStore = defineStore('outbreaks', {
  state: (): OutbreaksState => ({ reports: [], status: 'idle' }),

  getters: {
    isLoading: (state): boolean => state.status === 'loading',
    isSaving: (state): boolean => state.status === 'saving',
  },

  actions: {
    async loadReports(): Promise<void> {
      this.status = 'loading';
      try {
        const result = await outbreaks.listReports.execute();
        if (result.isOk()) this.reports = result.value;
      } finally {
        this.status = 'idle';
      }
    },

    async report(input: { district: string; disease: string; description: string }): Promise<string | null> {
      const user = useAuthStore().currentUser;
      this.status = 'saving';
      try {
        const command: ReportOutbreakCommand = {
          ...input,
          reporterName: user?.displayName ?? 'Anónimo',
          reporterAvatar: user?.avatarUrl ?? '',
        };
        const result = await outbreaks.reportOutbreak.execute(command);
        if (result.isErr()) return result.error.message;
        this.reports = [result.value, ...this.reports];
        return null;
      } finally {
        this.status = 'idle';
      }
    },
  },
});
