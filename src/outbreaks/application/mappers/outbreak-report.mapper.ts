import type { OutbreakReport } from '../../domain/model/outbreak-report.entity';
import type { DistrictName } from '../../domain/model/district.vo';
import type { OutbreakReportDto } from '../dto/outbreak-report.dto';

export const OutbreakReportMapper = {
  toDto(report: OutbreakReport): OutbreakReportDto {
    return {
      id: report.reportId,
      district: report.district.value as DistrictName,
      disease: report.disease,
      description: report.description,
      reporterName: report.reporterName,
      reporterAvatar: report.reporterAvatar,
      reportedAt: report.reportedAt,
    };
  },
};
