export {};

declare global {
  namespace YT {
    interface Player {
      loadVideoById(videoId: string): void;
      playVideo(): void;
      pauseVideo(): void;
      mute(): void;
      unMute(): void;
      destroy(): void;
    }

    interface PlayerEvent {
      target: Player;
    }

    interface OnStateChangeEvent {
      data: number;
    }

    interface OnErrorEvent {
      data: number;
    }

    enum PlayerState {
      UNSTARTED = -1,
      ENDED = 0,
      PLAYING = 1,
      PAUSED = 2,
      BUFFERING = 3,
      CUED = 5,
    }

    interface PlayerVars {
      autoplay?: 0 | 1;
      mute?: 0 | 1;
      controls?: 0 | 1;
      rel?: 0 | 1;
      modestbranding?: 0 | 1;
      iv_load_policy?: 1 | 3;
      playsinline?: 0 | 1;
    }

    interface PlayerOptions {
      height?: string;
      width?: string;
      videoId?: string;
      playerVars?: PlayerVars;
      events?: {
        onReady?: (event: PlayerEvent) => void;
        onStateChange?: (event: OnStateChangeEvent) => void;
        onError?: (event: OnErrorEvent) => void;
      };
    }

    interface PlayerConstructor {
      new (elementId: string | HTMLElement, options: PlayerOptions): Player;
    }

    interface YTNamespace {
      Player: PlayerConstructor;
      PlayerState: typeof PlayerState;
    }
  }

  interface Window {
    YT: YT.YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}
