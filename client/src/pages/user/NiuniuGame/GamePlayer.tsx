import type { Game, JSMpegPlayer } from "@/types";
import {
  CalendarDays,
  Expand,
  Settings,
  SquareArrowOutUpRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CardBoard from "./CardBoard";
import { GameProvider } from "@/contexts/GameContext";
import ResultTable from "./ResultTable";

interface GamePlayerProps {
  game: Game;
  onBack: () => void;
}

const GamePlayer: React.FC<GamePlayerProps> = ({ game, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [player, setPlayer] = useState<JSMpegPlayer | null>(null);

  useEffect(() => {
    if (!game || !game.active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = 1920;
    canvas.height = 1080;

    const loadPlayer = async () => {
      try {
        const JSMpeg = (await import("jsmpeg-player")).default;

        const isProduction = window.location.protocol === "https:";
        let videoUrl;

        if (isProduction) {
          videoUrl = `wss://${window.location.host}/ws/${game.wsPort}`;
        } else {
          videoUrl = `ws://${window.location.hostname}:${game.wsPort}`;
        }

        const newPlayer = new JSMpeg.Player(videoUrl, {
          canvas,
          autoplay: true,
          audio: false,
          onError: (err: Error) => {
            console.error("JSMpeg error:", err);
            setError("Failed to load video stream");
          },
        });

        setPlayer(newPlayer);
      } catch (err) {
        console.error("Error initializing player:", err);
        setError("Failed to initialize video player");
      }
    };

    loadPlayer();

    return () => {
      player?.destroy();
      setPlayer(null);
    };
  }, [game]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full object-contain" />

      <div className="absolute top-1 gap-5 right-0 flex items-center justify-between px-4 bg-gradient-to-b from-[#8b5e34]/90 to-[#4a362a]/70 z-10">
        <div className="flex gap-2">
          <button className="text-yellow-600 px-1">
            <CalendarDays className="w-5 h-5" />
          </button>
          <button className="text-yellow-600 px-1">
            <Expand className="w-5 h-5" />
          </button>
          <button className="text-yellow-600 px-1">
            <Settings className="w-5 h-5" />
          </button>
          <button onClick={onBack} className="text-yellow-600 px-1">
            <SquareArrowOutUpRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <GameProvider>
        <div className="absolute bottom-0 border-neutral-700 bg-neutral-900 left-0 w-full">
          <ResultTable />
        </div>

        <div className="absolute bottom-0 left-0 w-full">
          <CardBoard />
        </div>
      </GameProvider>

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-red-400 text-lg font-medium">
          {error}
        </div>
      )}
    </div>
  );
};

export default GamePlayer;
