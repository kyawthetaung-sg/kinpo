import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Camera, JSMpegPlayer } from "@/types";
import { CalendarDays, CircleUserRound, Expand, Headset, ReceiptJapaneseYen, Settings, SquareArrowOutUpRight, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import VideoPlayer from "./VideoPlayer";

const Home = () => {
  const [time, setTime] = useState(new Date());
  const canvasRef1 = useRef<HTMLCanvasElement>(null!);
  const canvasRef2 = useRef<HTMLCanvasElement>(null!);
  const [players, setPlayers] = useState<(JSMpegPlayer | null)[]>([null, null]);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  useEffect(() => {
    fetchCameras()
  }, [])

  const fetchCameras = async () => {
    try {
      const response = await fetch('/api/cameras')
      const data = await response.json()
      setCameras(data)
    } catch (error) {
      console.error('Failed to fetch cameras:', error)
    }
  }

  useEffect(() => {
    if (!cameras || cameras.length === 0 || selectedCamera) return;

    const loadPlayer = async (index: number, ref: React.RefObject<HTMLCanvasElement>) => {
      if (!cameras[index] || !cameras[index].active || !ref.current) return;

      try {
        const JSMpeg = (await import("jsmpeg-player")).default;
        const videoUrl = `ws://localhost:${cameras[index].wsPort}`;

        const newPlayer = new JSMpeg.Player(videoUrl, {
          canvas: ref.current,
          autoplay: true,
          audio: false,
          onError: (error: Error) => {
            console.error("JSMpeg error:", error);
          },
        });

        setPlayers((prev) => {
          const updated = [...prev];
          updated[index] = newPlayer;
          return updated;
        });
      } catch (error) {
        console.error(`Error initializing camera ${index + 1}:`, error);
      }
    };

    loadPlayer(0, canvasRef1);
    loadPlayer(1, canvasRef2);

    return () => {
      players.forEach((player) => player?.destroy());
      setPlayers([null, null]);
    };
  }, [cameras, selectedCamera]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const dateStr = time.toLocaleDateString();
  const timeStr = time.toLocaleTimeString();

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      {selectedCamera ? (
      <VideoPlayer
        camera={selectedCamera}
        onBack={() => setSelectedCamera(null)}
      />
    ) : (
      <>
        <div className="h-16 bg-gradient-to-r from-[#3b2a1f] to-[#2c1f16] flex px-4 text-white">
          <div className="flex items-center w-full gap-1">
            <Volume2 className="w-6 h-6 text-yellow-500" />
            <div className="flex-1 bg-gray-900 rounded-tl-lg rounded-l-lg px-2 overflow-hidden">
              <span className="text-lg whitespace-nowrap overflow-hidden text-ellipsis block animate-marquee">
                办理；详情请您咨询客服，感谢您的支持！请以准公司官方网址：m.870213011.com、pc.870213011.com
              </span>
            </div>

            {/* Right icons */}
            <div className="ml-2 flex items-center gap-3">
              <button className="text-yellow-600 px-1">
                <CalendarDays className="w-5 h-5" />
              </button>
              <button className="text-yellow-600 px-1">
                <Expand className="w-5 h-5" />
              </button>
              <button className="text-yellow-600 px-1">
                <Settings className="w-5 h-5" />
              </button>
              <button className="text-yellow-600 px-1">
                <SquareArrowOutUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>


        <div className="flex flex-1 overflow-hidden">
          <div className="bg-[#2c1f16] flex flex-col gap-3 w-[150px]">
            <div className="flex items-center justify-center">
              <img
                src="/src/assets/images/logo.png"
                alt="card-grid"
                className="w-25 object-contain"
              />
            </div>

            <div className="flex flex-col items-center p-2 gap-1">
              <div className="flex items-center text-sm text-yellow-200 bg-gray-900 rounded-xl w-full py-1 px-2">
                <CircleUserRound className="w-4 h-4 mr-1" />
                <span>kinpo</span>
              </div>
              <div className="flex items-center text-sm text-yellow-200 bg-gray-900 rounded-xl w-full py-1 px-2">
                <ReceiptJapaneseYen className="w-4 h-4 mr-1" />
                <span>53</span>
              </div>
            </div>

            <Button
              variant="secondary"
              className="bg-[#8b5e34] hover:bg-[#9a6d40] text-2xl p-6 text-white rounded-none rounded-tl-2xl"
            >
              全部
            </Button>

            <Button
              variant="secondary"
              className="bg-[#8b5e34] hover:bg-[#9a6d40] text-2xl p-6 text-white rounded-none rounded-tl-2xl"
            >
              百家乐
            </Button>

            <Button
              variant="secondary"
              className="bg-[#8b5e34] hover:bg-[#9a6d40] text-2xl p-6 text-white rounded-none rounded-tl-2xl"
            >
              龙虎
            </Button>

            <Button
              variant="secondary"
              className="bg-[#8b5e34] hover:bg-[#9a6d40] text-2xl p-6 text-white rounded-none rounded-tl-2xl"
            >
              多台下注
            </Button>

            <div className="text-lg text-center text-gray-400">
              {dateStr}
              <br />
              {timeStr}
            </div>
            <Button
              variant="secondary"
              className="bg-[#8b5e34] hover:bg-[#9a6d40] text-2xl p-6 text-white rounded-none mt-auto flex items-center justify-center gap-3"
            >
              <Headset className="w-6 h-6" />
              在线客服
            </Button>
          </div>

          <div className="flex-1 bg-[#1e1611] overflow-hidden">
            <ScrollArea className="h-full p-4 scrollbar-hide">
              <div className="grid grid-cols-2 gap-4">
                {cameras.map((camera) => (
                  <Card
                    key={camera.id}
                    onClick={() => setSelectedCamera(camera)}
                    className="bg-[#4a362a] rounded-sm border border-gray-600 text-white py-0 gap-0"
                  >
                    <CardHeader className="flex justify-between items-center">
                      <CardTitle className="text-white text-2xl font-bold">
                        {camera.code}
                      </CardTitle>
                      <div className="bg-black text-white text-xl px-5 py-1 rounded">
                        {camera.name}
                      </div>
                    </CardHeader>

                    <CardContent className="p-1 flex items-center justify-center">
                      <img
                        src="/src/assets/images/g1.png"
                        alt="card-grid"
                        className="w-full h-full object-contain"
                      />
                    </CardContent>

                    <CardFooter>
                      <div className="grid grid-cols-4 gap-4 pb-3">
                        <div className="flex gap-2">
                          <span className="text-red-600">庄</span>
                          <span>{camera.banker}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-cyan-300">闲</span>
                          <span>{camera.player}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-lime-500">和</span>
                          <span>{camera.tie}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-white">总数</span>
                          <span>{camera.total}</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="w-[250px] bg-[#2c1f16] flex flex-col justify-between p-3">
            <div className="space-y-3">
              <div className="aspect-video bg-[#4a362a] flex items-center justify-center text-sm text-white relative overflow-hidden">
                <canvas
                  ref={canvasRef1}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
              <div className="aspect-video bg-[#4a362a] flex items-center justify-center text-sm text-white relative overflow-hidden">
                <canvas
                  ref={canvasRef2}
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    )}
    </div>
  );
};

export default Home;
