import type { UseCase } from '@/shared/application/use-case';
import { ok, type Result } from '@/shared/domain/result';
import type { DomainError } from '@/shared/domain/domain-error';

import type { OutbreakReportRepository } from '../../domain/repositories/outbreak-report.repository';
import type { OutbreakReportDto } from '../dto/outbreak-report.dto';
import { OutbreakReportMapper } from '../mappers/outbreak-report.mapper';

/** Lists all community outbreak reports. */
export class ListReportsUseCase
  implements UseCase<void, Result<OutbreakReportDto[], DomainError>>
{
  constructor(private readonly reports: OutbreakReportRepository) {}

  async execute(): Promise<Result<OutbreakReportDto[], DomainError>> {
    const all = await this.reports.listAll();
    return ok(all.map(OutbreakReportMapper.toDto));
  }
}
