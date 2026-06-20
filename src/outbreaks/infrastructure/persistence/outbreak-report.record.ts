import { OutbreakReport } from '../../domain/model/outbreak-report.entity';
import { District } from '../../domain/model/district.vo';

export interface OutbreakReportRecord {
  id: string;
  district: string;
  disease: string;
  description: string;
  reporterName: string;
  reporterAvatar: string;
  reportedAt: string;
}

export class OutbreakReportAssembler {
  static toDomain(record: OutbreakReportRecord): OutbreakReport {
    const district = District.create(record.district);
    if (district.isErr()) {
      throw new Error(`Corrupt report ${record.id}: invalid district "${record.district}".`);
    }
    return OutbreakReport.create(record.id, {
      district: district.value,
      disease: record.disease,
      description: record.description,
      reporterName: record.reporterName,
      reporterAvatar: record.reporterAvatar ?? '',
      reportedAt: record.reportedAt,
    });
  }

  static toRecord(report: OutbreakReport): OutbreakReportRecord {
    return {
      id: report.reportId,
      district: report.district.toString(),
      disease: report.disease,
      description: report.description,
      reporterName: report.reporterName,
      reporterAvatar: report.reporterAvatar,
      reportedAt: report.reportedAt,
    };
  }
}
