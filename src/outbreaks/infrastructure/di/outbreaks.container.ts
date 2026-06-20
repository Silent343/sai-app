import { AxiosHttpClient } from '@/shared/infrastructure/http/axios-http-client';
import { UuidIdGenerator } from '@/shared/infrastructure/uuid-id-generator';
import { TOKEN_STORAGE_KEY } from '@/iam/infrastructure/di/iam.container';

import { OutbreakReportApiRepository } from '../persistence/outbreak-report-api.repository';
import { ListReportsUseCase } from '../../application/use-cases/list-reports.use-case';
import { ReportOutbreakUseCase } from '../../application/use-cases/report-outbreak.use-case';

/** Composition root for the Outbreaks bounded context. */
function buildOutbreaksContainer() {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const http = new AxiosHttpClient(baseURL, () => localStorage.getItem(TOKEN_STORAGE_KEY));

  const reports = new OutbreakReportApiRepository(http);
  const idGenerator = new UuidIdGenerator();

  return {
    listReports: new ListReportsUseCase(reports),
    reportOutbreak: new ReportOutbreakUseCase(reports, idGenerator),
  } as const;
}

export type OutbreaksContainer = ReturnType<typeof buildOutbreaksContainer>;

export const outbreaks: OutbreaksContainer = buildOutbreaksContainer();
