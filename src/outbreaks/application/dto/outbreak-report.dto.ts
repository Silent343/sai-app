import type { DistrictName } from '../../domain/model/district.vo';

/** Read model of a community outbreak report. */
export interface OutbreakReportDto {
  id: string;
  district: DistrictName;
  disease: string;
  description: string;
  reporterName: string;
  reporterAvatar: string;
  reportedAt: string;
}

export interface ReportOutbreakCommand {
  district: string;
  disease: string;
  description: string;
  reporterName: string;
  reporterAvatar: string;
}
