import type { VideoSource } from '../../domain/model/video-guide.entity';

/** Read model of a recommended video guide. */
export interface VideoGuideDto {
  id: string;
  title: string;
  topic: string;
  source: VideoSource;
  embedUrl: string;
}
