/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';

import { Volume2, VolumeX, SkipForward, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import type { YT } from 'youtube-player';
// Use the global YT type from the YouTube IFrame API instead.
import { VideoData, VIDEOS, extractVideoId } from '../../lib/video-ids';

export default function Home() {
  const playerRef = useRef<YT.Player | null>(null);
  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const isPlayerReadyRef = useRef(false);

  const [hasError, setHasError] = useState(false);
  const [viewers, setViewers] = useState(0);

  const getRandomVideo = () => {
    const randomIndex = Math.floor(Math.random() * VIDEOS.length);
    return VIDEOS[randomIndex];
  };
  const loadNextVideo = () => {
    const nextVideo = getRandomVideo();
    setCurrentVideo(nextVideo);
    setHasError(false);

    const videoId = extractVideoId(nextVideo.video_link);

    if (playerRef.current && isPlayerReadyRef.current) {
      playerRef.current.mute(); // opcional para evitar bloqueos
      setIsMuted(true);
      playerRef.current.loadVideoById(videoId);
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    (window as any).onYouTubeIframeAPIReady = () => {
      const initialVideo = VIDEOS.find((v) => v.id === 1) ?? getRandomVideo();
      setCurrentVideo(initialVideo);
      const videoId = extractVideoId(initialVideo.video_link);

      playerRef.current = new (window as any).YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event: YT.PlayerEvent) => {
            isPlayerReadyRef.current = true;
            setIsPlayerReady(true);
            event.target.playVideo();
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            if (event.data === (window as any).YT.PlayerState.ENDED) {
              loadNextVideo();
            }
          },
          onError: (event: YT.OnErrorEvent) => {
            setHasError(true);
            setTimeout(() => {
              loadNextVideo();
            }, 2000);
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <main className='flex min-h-screen flex-col bg-background'>
      <nav className='border-b border-border bg-card'>
        <div className='mx-auto flex max-w-[1920px] items-center justify-between px-4 py-3'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary'>
              <Radio className='h-6 w-6 text-primary-foreground' />
            </div>
            <div>
              <h1 className='text-xl font-bold tracking-tight text-foreground'>
                FGC TV
              </h1>
              <p className='text-xs text-muted-foreground'>24/7 Replays</p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-2 rounded-md bg-destructive/20 px-3 py-1.5'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-destructive' />
              <span className='text-sm font-semibold uppercase tracking-wider text-destructive'>
                Live
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className='mx-auto w-full max-w-[1920px] flex-1 p-4'>
        <div className='overflow-hidden rounded-lg border border-border bg-black shadow-lg'>
          <div className='relative aspect-video w-full bg-black'>
            <div id='youtube-player' className='absolute inset-0' />

            {hasError && (
              <div className='absolute inset-0 flex items-center justify-center bg-black/80'>
                <p className='text-white'>Video unavailable, loading next...</p>
              </div>
            )}

            {currentVideo && !hasError && (
              <div className='absolute left-0 right-0 top-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='rounded bg-primary/90 px-2 py-1 text-xs font-semibold text-primary-foreground'>
                      {currentVideo.tag}
                    </div>
                    <div className='text-sm text-white/90'>
                      {currentVideo.game}
                    </div>
                  </div>
                </div>
                <div className='mt-3 flex items-center justify-center gap-4 text-white'>
                  <div className='text-right'>
                    <div className='text-lg font-bold'>
                      {currentVideo.p1_name}
                    </div>
                    <div className='text-sm text-white/70'>
                      {currentVideo.p1_char}
                    </div>
                  </div>
                  <div className='text-2xl font-bold text-white/50'>VS</div>
                  <div className='text-left'>
                    <div className='text-lg font-bold'>
                      {currentVideo.p2_name}
                    </div>
                    <div className='text-sm text-white/70'>
                      {currentVideo.p2_char}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className='absolute bottom-4 right-4 flex gap-2'>
              <Button
                onClick={toggleMute}
                size='icon'
                variant='outline'
                className='h-10 w-10 bg-black/60 backdrop-blur-sm hover:bg-black/80'
              >
                {isMuted ? (
                  <VolumeX className='h-4 w-4' />
                ) : (
                  <Volume2 className='h-4 w-4' />
                )}
              </Button>

              <Button
                onClick={loadNextVideo}
                size='icon'
                variant='outline'
                className='h-10 w-10 bg-black/60 backdrop-blur-sm hover:bg-black/80'
              >
                <SkipForward className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
