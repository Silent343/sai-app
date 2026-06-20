import { Entity } from '@/shared/domain/entity';
import { ValueObject } from '@/shared/domain/value-object';

/** Identity of a VideoGuide. */
export class VideoGuideId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }
  static of(value: string): VideoGuideId {
    return new VideoGuideId(value);
  }
  toString(): string {
    return this.value;
  }
}

export type VideoSource = 'youtube' | 'facebook';

export interface VideoGuideProps {
  title: string;
  topic: string;
  source: VideoSource;
  embedUrl: string;
}

/** A recommended educational video guide about infectious diseases. */
export class VideoGuide extends Entity<VideoGuideId> {
  private constructor(id: VideoGuideId, private props: VideoGuideProps) {
    super(id);
  }

  static create(id: string, props: VideoGuideProps): VideoGuide {
    return new VideoGuide(VideoGuideId.of(id), props);
  }

  get videoId(): string {
    return this.id.value;
  }
  get title(): string {
    return this.props.title;
  }
  get topic(): string {
    return this.props.topic;
  }
  get source(): VideoSource {
    return this.props.source;
  }
  get embedUrl(): string {
    return this.props.embedUrl;
  }
}
