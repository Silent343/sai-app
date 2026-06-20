import type { UseCase } from '@/shared/application/use-case';
import { ok, err, type Result } from '@/shared/domain/result';
import type { DomainError } from '@/shared/domain/domain-error';
import type { IdGenerator } from '@/shared/application/id-generator';

import type { OutbreakReportRepository } from '../../domain/repositories/outbreak-report.repository';
import { OutbreakReport } from '../../domain/model/outbreak-report.entity';
import { District } from '../../domain/model/district.vo';
import { EmptyReportError } from '../../domain/errors/outbreak.errors';

import type { ReportOutbreakCommand, OutbreakReportDto } from '../dto/outbreak-report.dto';
import { OutbreakReportMapper } from '../mappers/outbreak-report.mapper';

/** Publishes a new community outbreak report after validating its fields. */
export class ReportOutbreakUseCase
  implements UseCase<ReportOutbreakCommand, Result<OutbreakReportDto, DomainError>>
{
  constructor(
    private readonly reports: OutbreakReportRepository,
    private readonly ids: IdGenerator,
  ) {}

  async execute(cmd: ReportOutbreakCommand): Promise<Result<OutbreakReportDto, DomainError>> {
    const district = District.create(cmd.district);
    if (district.isErr()) return err(district.error);

    const disease = cmd.disease.trim();
    const description = cmd.description.trim();
    if (disease.length === 0 || description.length === 0) {
      return err(new EmptyReportError());
    }

    const report = OutbreakReport.create(this.ids.generate(), {
      district: district.value,
      disease,
      description,
      reporterName: cmd.reporterName.trim() || 'Anónimo',
      reporterAvatar: cmd.reporterAvatar,
      reportedAt: new Date().toISOString(),
    });

    await this.reports.save(report);
    return ok(OutbreakReportMapper.toDto(report));
  }
}
