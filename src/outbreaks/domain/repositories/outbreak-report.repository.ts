import type { OutbreakReport } from '../model/outbreak-report.entity';

/** Persistence port for community outbreak reports. */
export interface OutbreakReportRepository {
  /** All reports, most recent first. */
  listAll(): Promise<OutbreakReport[]>;
  save(report: OutbreakReport): Promise<void>;
}
