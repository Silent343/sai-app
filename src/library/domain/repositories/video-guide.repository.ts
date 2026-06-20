import type { VideoGuide } from '../model/video-guide.entity';

/** Read-only catalogue of recommended video guides. */
export interface VideoGuideRepository {
  listAll(): Promise<VideoGuide[]>;
}
