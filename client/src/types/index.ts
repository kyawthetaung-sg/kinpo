export interface Camera {
  id: number;
  code: string;
  name: string;
  url: string;
  wsPort: number;
  active: boolean;
  banker: number;
  player: number;
  tie: number;
  total: number;
}

export interface JSMpegPlayer {
  destroy: () => void;
}