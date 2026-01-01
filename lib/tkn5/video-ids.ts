
export const GAME = 'tkn5' as const;

export type VideoData = {
  id: number;
  upload_date: string;
  tag: string;
  p1_name: string;
  p1_char: string;
  p2_name: string;
  p2_char: string;
  video_link: string;
  game: string;
};

export const VIDEOS_TKN5: VideoData[] = [
  {
    id: 269902372766810,
    upload_date: '2009-05-25',
    tag: '',
    p1_name: 'Blackblade8',
    p1_char: 'Julia',
    p2_name: 'natannnn',
    p2_char: 'Kazuya',
    video_link: 'https://www.youtube.com/watch?v=Tk1A5NuEKnU',
    game: 'tkn5',
  },
];

export default VIDEOS_TKN5;
