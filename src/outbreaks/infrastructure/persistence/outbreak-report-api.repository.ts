import type { HttpClient } from '@/shared/infrastructure/http/http-client';
import type { OutbreakReportRepository } from '../../domain/repositories/outbreak-report.repository';
import type { OutbreakReport } from '../../domain/model/outbreak-report.entity';
import { OutbreakReportAssembler, type OutbreakReportRecord } from './outbreak-report.record';

/**
 * REST adapter for OutbreakReportRepository, backed by json-server.
 * CRUD over /reports:  GET /reports?_sort=reportedAt&_order=desc, POST /reports
 */
export class OutbreakReportApiRepository implements OutbreakReportRepository {
  private readonly resource = '/reports';

  constructor(private readonly http: HttpClient) {}

  async listAll(): Promise<OutbreakReport[]> {
    const records = await this.http.get<OutbreakReportRecord[]>(this.resource, {
      _sort: 'reportedAt',
      _order: 'desc',
    });
    return records.map(OutbreakReportAssembler.toDomain);
  }

  async save(report: OutbreakReport): Promise<void> {
    await this.http.post<OutbreakReportRecord>(
      this.resource,
      OutbreakReportAssembler.toRecord(report),
    );
  }
}
