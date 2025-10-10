declare module "jsmpeg-player" {
  interface JSMpegOptions {
    canvas?: HTMLCanvasElement | null;
    autoplay?: boolean;
    audio?: boolean;
    onPlay?: () => void;
    onError?: (error: Error) => void;
    onStalled?: () => void;
  }

  interface JSMpegPlayerInstance {
    play(): void;
    pause(): void;
    stop(): void;
    destroy(): void;
    volume: number;
    paused: boolean;
  }

  export default class JSMpeg {
    static Player: new (url: string, options?: JSMpegOptions) => JSMpegPlayerInstance;
  }
}
