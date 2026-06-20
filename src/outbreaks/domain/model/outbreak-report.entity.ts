import { Entity } from '@/shared/domain/entity';
import { ValueObject } from '@/shared/domain/value-object';
import { District } from './district.vo';

/** Identity of an OutbreakReport. */
export class OutbreakReportId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }
  static of(value: string): OutbreakReportId {
    return new OutbreakReportId(value);
  }
  toString(): string {
    return this.value;
  }
}

export interface OutbreakReportProps {
  district: District;
  disease: string;
  description: string;
  reporterName: string;
  reporterAvatar: string;
  reportedAt: string;
}

/**
 * A community-published disease report ("secciones que las personas publican").
 * Aggregate root: owns its district (a value object) and the reported facts.
 */
export class OutbreakReport extends Entity<OutbreakReportId> {
  private constructor(id: OutbreakReportId, private props: OutbreakReportProps) {
    super(id);
  }

  static create(id: string, props: OutbreakReportProps): OutbreakReport {
    return new OutbreakReport(OutbreakReportId.of(id), props);
  }

  get reportId(): string {
    return this.id.value;
  }
  get district(): District {
    return this.props.district;
  }
  get disease(): string {
    return this.props.disease;
  }
  get description(): string {
    return this.props.description;
  }
  get reporterName(): string {
    return this.props.reporterName;
  }
  get reporterAvatar(): string {
    return this.props.reporterAvatar;
  }
  get reportedAt(): string {
    return this.props.reportedAt;
  }
}
