import VIDEOS_2XKO from './2xko/video-ids';
import VIDEOS_ABK from './abk/video-ids';
import VIDEOS_ACPR from './acpr/video-ids';
import VIDEOS_ASBR from './asbr/video-ids';
import VIDEOS_BBCF from './bbcf/video-ids';
import VIDEOS_BBTAG from './bbtag/video-ids';
import VIDEOS_COTW from './cotw/video-ids';
import VIDEOS_D012 from './d012/video-ids';
import VIDEOS_DBFZ from './dbfz/video-ids';
import VIDEOS_DNF from './dnf/video-ids';
import VIDEOS_F8UC from './f8uc/video-ids';
import VIDEOS_GBVS from './gbvs/video-ids';
import VIDEOS_HXH from './hxh/video-ids';
import VIDEOS_ISVS from './isvs/video-ids';
import VIDEOS_KOFXV from './kofxv/video-ids';
import VIDEOS_P4AU from './p4au/video-ids';
import VIDEOS_ROA from './roa/video-ids';
import VIDEOS_SAMSHO from './samsho/video-ids';
import VIDEOS_SCON4 from './scon4/video-ids';
import VIDEOS_SF6 from './sf6/video-ids';
import VIDEOS_SFV from './sfv/video-ids';
import VIDEOS_SOKU from './soku/video-ids';
import VIDEOS_STRIVE from './strive/video-ids';
import VIDEOS_TFH from './tfh/video-ids';
import VIDEOS_TKN5 from './tkn5/video-ids';
import VIDEOS_TKN8 from './tkn8/video-ids';
import VIDEOS_UMVC3 from './umvc3/video-ids';
import VIDEOS_UNIB from './unib/video-ids';
import VIDEOS_VF5 from './vf5/video-ids';
import { VIDEOSMELY } from './melty/video-ids';
import { VIDEOS3ERSTIKE } from './3rstrike/video-ids';
import { VIDEOSLUMINAMELTY } from './melty-lumina/video-ids';
import VIDEOS_VSAV from './vsav/video-ids';
import VIDEOS_XRD from './xrd/video-ids';

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
  ...VIDEOS_2XKO,
  ...VIDEOS_ABK,
  ...VIDEOS_ACPR,
  ...VIDEOS_ASBR,
  ...VIDEOS_BBCF,
  ...VIDEOS_BBTAG,
  ...VIDEOS_COTW,
  ...VIDEOS_D012,
  ...VIDEOS_DBFZ,
  ...VIDEOS_DNF,
  ...VIDEOS_F8UC,
  ...VIDEOS_GBVS,
  ...VIDEOS_HXH,
  ...VIDEOS_ISVS,
  ...VIDEOS_KOFXV,
  ...VIDEOS_P4AU,
  ...VIDEOS_ROA,
  ...VIDEOS_SAMSHO,
  ...VIDEOS_SCON4,
  ...VIDEOS_SF6,
  ...VIDEOS_SFV,
  ...VIDEOS_SOKU,
  ...VIDEOS_STRIVE,
  ...VIDEOS_TFH,
  ...VIDEOS_TKN5,
  ...VIDEOS_TKN8,
  ...VIDEOS_UMVC3,
  ...VIDEOS_UNIB,
  ...VIDEOS_VF5,
  ...VIDEOS_VSAV,
  ...VIDEOS_XRD,
];

// Helper function to extract video ID from YouTube URL
export function extractVideoId(url: string): string {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : '';
}
