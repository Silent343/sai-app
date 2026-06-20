import { VideoGuide, type VideoSource } from '../../domain/model/video-guide.entity';

export interface VideoGuideRecord {
  id: string;
  title: string;
  topic: string;
  source: string;
  embedUrl: string;
}

export class VideoGuideAssembler {
  static toDomain(record: VideoGuideRecord): VideoGuide {
    return VideoGuide.create(record.id, {
      title: record.title,
      topic: record.topic,
      source: normalizeSource(record.source),
      embedUrl: record.embedUrl,
    });
  }
}

function normalizeSource(value: string): VideoSource {
  return value === 'facebook' ? 'facebook' : 'youtube';
}
