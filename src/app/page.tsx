'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Volume2, VolumeX, SkipForward, Radio, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VideoData, VIDEOS, extractVideoId } from '../../lib/video-ids';

function GameChips({
  games,
  value,
  onChange,
  counts,
}: {
  games: string[];
  value: 'ALL' | string;
  onChange: (v: 'ALL' | string) => void;
  counts: Record<string, number>;
}) {
  const items = ['ALL', ...games];

  return (
    <div className='flex w-full items-center gap-2 overflow-x-auto pb-1 pt-2'>
      {items.map((g) => {
        const active = value === g;
        const label = g === 'ALL' ? 'All' : g;
        const count = g === 'ALL' ? counts.__ALL__ ?? 0 : counts[g] ?? 0;

        return (
          <button
            key={g}
            type='button'
            onClick={() => onChange(g)}
            className={[
              'shrink-0 rounded-full border px-3 py-1 text-sm transition',
              active
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:bg-muted',
            ].join(' ')}
          >
            {label}
            <span className='ml-2 opacity-70'>({count})</span>
          </button>
        );
      })}
    </div>
  );
}

export default function Home() {
  const playerRef = useRef<YT.Player | null>(null);

  const [currentVideo, setCurrentVideo] = useState<VideoData | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);

  const [hasStarted, setHasStarted] = useState(false);
  const hasStartedRef = useRef(false);

  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const isPlayerReadyRef = useRef(false);

  const [hasError, setHasError] = useState(false);

  // Filtros
  const [gameFilter, setGameFilter] = useState<'ALL' | string>('ALL');

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const games = useMemo(() => {
    const set = new Set<string>();
    for (const v of VIDEOS) if (v?.game) set.add(v.game);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  const gameCounts = useMemo(() => {
    const counts: Record<string, number> = { __ALL__: VIDEOS.length };
    for (const v of VIDEOS) {
      const g = v.game || 'unknown';
      counts[g] = (counts[g] || 0) + 1;
    }
    return counts;
  }, []);

  const filteredVideos = useMemo(() => {
    if (gameFilter === 'ALL') return VIDEOS;
    return VIDEOS.filter((v) => v.game === gameFilter);
  }, [gameFilter]);

  const getRandomVideo = () => {
    const pool = filteredVideos;
    if (!pool.length) return null;

    // evita repetir el mismo vídeo inmediatamente (cuando sea posible)
    if (pool.length === 1) return pool[0];

    let next = pool[Math.floor(Math.random() * pool.length)];
    if (currentVideo) {
      let guard = 0;
      while (next.id === currentVideo.id && guard < 10) {
        next = pool[Math.floor(Math.random() * pool.length)];
        guard += 1;
      }
    }
    return next;
  };

  const applyMuteState = (player: YT.Player) => {
    if (isMutedRef.current) player.mute();
    else player.unMute();
  };

  const loadNextVideo = () => {
    const nextVideo = getRandomVideo();
    if (!nextVideo) {
      setHasError(true);
      setCurrentVideo(null);
      return;
    }

    setCurrentVideo(nextVideo);
    setHasError(false);

    const player = playerRef.current;
    if (!player || !isPlayerReadyRef.current) return;

    // Si el usuario aún no ha hecho click, NO intentes reproducir.
    if (!hasStartedRef.current) return;

    const videoId = extractVideoId(nextVideo.video_link);
    applyMuteState(player);
    player.loadVideoById(videoId);
  };

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player) return;

    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;

      if (next) player.mute();
      else player.unMute();

      return next;
    });
  };

  const startPlayback = () => {
    const player = playerRef.current;
    if (!player || !isPlayerReadyRef.current) return;

    const initial = currentVideo ?? getRandomVideo();
    if (!initial) return;

    setCurrentVideo(initial);

    hasStartedRef.current = true;
    setHasStarted(true);

    // Asegura sonido
    isMutedRef.current = false;
    setIsMuted(false);

    const videoId = extractVideoId(initial.video_link);

    // En el click (gesto del usuario) ya puedes arrancar con audio
    player.unMute();
    player.loadVideoById(videoId);
  };

  // Cargar API YT y crear player
  useEffect(() => {
    if (
      !document.querySelector(
        'script[src="https://www.youtube.com/iframe_api"]'
      )
    ) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    window.onYouTubeIframeAPIReady = () => {
      const initialVideo = getRandomVideo();
      setCurrentVideo(initialVideo);

      const videoId = initialVideo
        ? extractVideoId(initialVideo.video_link)
        : '';

      playerRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId,
        playerVars: {
          autoplay: 0,
          mute: 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          playsinline: 1,
        },
        events: {
          onReady: () => {
            isPlayerReadyRef.current = true;
            setIsPlayerReady(true);
          },
          onStateChange: (event: YT.OnStateChangeEvent) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              loadNextVideo();
            }
          },
          onError: () => {
            setHasError(true);
            if (hasStartedRef.current) {
              setTimeout(loadNextVideo, 1500);
            }
          },
        },
      });
    };

    return () => {
      if (playerRef.current) playerRef.current.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cuando cambia el filtro: selecciona vídeo del nuevo pool y, si ya empezó, lo carga
  useEffect(() => {
    const next = getRandomVideo();
    if (!next) {
      setHasError(true);
      setCurrentVideo(null);
      return;
    }

    setCurrentVideo(next);
    setHasError(false);

    const player = playerRef.current;
    if (!player || !isPlayerReadyRef.current) return;
    if (!hasStartedRef.current) return;

    const videoId = extractVideoId(next.video_link);
    applyMuteState(player);
    player.loadVideoById(videoId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameFilter]);

  return (
    <main className='flex min-h-screen flex-col bg-background'>
      <nav className='border-b border-border bg-card'>
        <div className='mx-auto flex w-full max-w-[1920px] flex-col gap-2 px-4 py-3'>
          <div className='flex items-center justify-between'>
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

            <div className='flex items-center gap-2 rounded-md bg-destructive/20 px-3 py-1.5'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-destructive' />
              <span className='text-sm font-semibold uppercase tracking-wider text-destructive'>
                Live
              </span>
            </div>
          </div>

          {/* FILTROS */}
          <GameChips
            games={games}
            value={gameFilter}
            onChange={setGameFilter}
            counts={gameCounts}
          />
        </div>
      </nav>

      <div className='mx-auto w-full max-w-[1920px] flex-1 p-4'>
        <div className='overflow-hidden rounded-lg border border-border bg-black shadow-lg'>
          <div className='relative aspect-video w-full bg-black'>
            <div id='youtube-player' className='absolute inset-0' />

            {!hasStarted && (
              <div className='absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70'>
                <div className='text-center'>
                  <p className='text-white text-lg font-semibold'>
                    Pulsa para reproducir con sonido
                  </p>
                  <p className='text-white/70 text-sm'>
                    El navegador bloquea autoplay con audio sin interacción.
                  </p>
                </div>
                <Button onClick={startPlayback} className='gap-2'>
                  <Play className='h-4 w-4' />
                  Play
                </Button>
              </div>
            )}

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

                  <div className='text-xs text-white/70'>
                    Pool: {filteredVideos.length}
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
                disabled={!isPlayerReady}
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
                disabled={!isPlayerReady || filteredVideos.length === 0}
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
