import type { UseCase } from '@/shared/application/use-case';
import { ok, type Result } from '@/shared/domain/result';
import type { DomainError } from '@/shared/domain/domain-error';

import type { VideoGuideRepository } from '../../domain/repositories/video-guide.repository';
import type { VideoGuideDto } from '../dto/video-guide.dto';

/** Lists all recommended video guides. */
export class ListVideosUseCase
  implements UseCase<void, Result<VideoGuideDto[], DomainError>>
{
  constructor(private readonly videos: VideoGuideRepository) {}

  async execute(): Promise<Result<VideoGuideDto[], DomainError>> {
    const all = await this.videos.listAll();
    return ok(
      all.map((v) => ({
        id: v.videoId,
        title: v.title,
        topic: v.topic,
        source: v.source,
        embedUrl: v.embedUrl,
      })),
    );
  }
}
