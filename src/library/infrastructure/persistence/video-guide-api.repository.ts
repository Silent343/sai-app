import type { HttpClient } from '@/shared/infrastructure/http/http-client';
import type { VideoGuideRepository } from '../../domain/repositories/video-guide.repository';
import type { VideoGuide } from '../../domain/model/video-guide.entity';
import { VideoGuideAssembler, type VideoGuideRecord } from './video-guide.record';

/** REST adapter for VideoGuideRepository, backed by json-server (GET /videos). */
export class VideoGuideApiRepository implements VideoGuideRepository {
  private readonly resource = '/videos';

  constructor(private readonly http: HttpClient) {}

  async listAll(): Promise<VideoGuide[]> {
    const records = await this.http.get<VideoGuideRecord[]>(this.resource);
    return records.map(VideoGuideAssembler.toDomain);
  }
}
