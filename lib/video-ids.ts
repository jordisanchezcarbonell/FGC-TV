import { VIDEOSMELY } from './vide-melty';
import { VIDEOS3ERSTIKE } from './video-3rstrike';
import { VIDEOSLUMINAMELTY } from './video-lumina-melty';

export interface VideoData {
  id: number;
  upload_date: string;
  tag: string;
  p1_name: string;
  p1_char: string;
  p2_name: string;
  p2_char: string;
  video_link: string;
  game: string;
}

// Sample of first 50 videos from the JSON data

export const VIDEOS: VideoData[] = [
  ...VIDEOS3ERSTIKE,
  ...VIDEOSMELY,
  ...VIDEOSLUMINAMELTY,
];

// Helper function to extract video ID from YouTube URL
export function extractVideoId(url: string): string {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : '';
}
