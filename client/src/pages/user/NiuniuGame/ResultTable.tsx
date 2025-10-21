import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { getNiuniuResults } from "@/api/niuniuResult";
import { NiuniuResult } from "@/types";
import { useGameContext } from "@/contexts/GameContext";

const ResultTable = () => {
  const [roundsData, setRoundsData] = useState<NiuniuResult[]>([]);
  const { refreshKey } = useGameContext();
  const players = ["庄", "闲1", "闲2", "闲3"];

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const results = await getNiuniuResults();
        setRoundsData(results);
      } catch (err) {
        console.error("Failed to fetch Niuniu results:", err);
      }
    };
    fetchResults();
  }, [refreshKey]);

  const rounds = React.useMemo(() => {
    return players.map((_, rowIndex) =>
      roundsData.map((r) => {
        const cellValue =
          rowIndex === 0
            ? r.banker || "N"
            : rowIndex === 1
              ? r.player1 || "N"
              : rowIndex === 2
                ? r.player2 || "N"
                : r.player3 || "N";

        const bankerValue = r.banker;
        const playerValue =
          rowIndex === 0
            ? bankerValue
            : rowIndex === 1
              ? r.player1
              : rowIndex === 2
                ? r.player2
                : r.player3;

        const win =
          rowIndex === 0
            ? [r.player1, r.player2, r.player3].some(
                (p) => p && bankerValue > p
              )
            : playerValue && playerValue > bankerValue;

        return { value: cellValue, win };
      })
    );
  }, [roundsData]);

  const winCounts = React.useMemo(() => {
    const counts = [0, 0, 0, 0];
    rounds.forEach((row, rowIndex) => {
      if (rowIndex === 0) return;
      row.forEach((cell) => {
        if (cell.win) {
          counts[rowIndex - 1] += 1;
          counts[3] += 1;
        }
      });
    });

    return counts;
  }, [rounds]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center px-4 py-1 bg-black/80">
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-white">
            <Icons.arrowRightLeft className="mr-1" /> 切换视频
          </Button>
          <Button variant="ghost" className="text-white">
            <Icons.rotateCcw className="mr-1" /> 刷新视频
          </Button>
        </div>
      </div>

      <Card className="w-full p-0 rounded-none border-none">
        <CardContent className="p-0">
          <div className="flex w-full">
            <div className="flex flex-col bg-[#3a2f1d] text-white text-center font-bold min-w-[80px]">
              <div className="flex items-center justify-between px-2 py-2 border-none">
                <span className="text-sky-300">闲1</span>
                <span className="text-white">{winCounts[0]}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-2 border-none">
                <span className="text-sky-300">闲3</span>
                <span className="text-white">{winCounts[1]}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-2 border-none">
                <span className="text-sky-300">闲3</span>
                <span className="text-white">{winCounts[2]}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-2 border-none">
                <span className="text-white">总数</span>
                <span className="text-white">{winCounts[3]}</span>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto">
              <div className="flex flex-col">
                {rounds.map((row, rowIndex) => {
                  const filledRow = [
                    ...row,
                    ...Array.from({ length: 35 - row.length }, () => ({
                      value: "",
                      win: false,
                    })),
                  ];

                  return (
                    <div
                      key={rowIndex}
                      className="flex border-b border-gray-300 last:border-none"
                    >
                      <div className="w-10 h-10 flex items-center justify-center border border-gray-300 relative bg-white/5">
                        <div
                          className={cn(
                            "flex items-center justify-center",
                            rowIndex === 0 ? "text-red-500" : "text-sky-500"
                          )}
                        >
                          {players[rowIndex]}
                        </div>
                      </div>

                      {filledRow.map((cell, i) => (
                        <div
                          key={i}
                          className="w-10 h-10 flex items-center justify-center border border-gray-300 relative bg-white/5"
                        >
                          {cell.value && (
                            <div
                              className={cn(
                                "w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold",
                                rowIndex === 0
                                  ? "bg-red-600 text-white"
                                  : "bg-blue-600 text-white"
                              )}
                            >
                              {cell.value}
                            </div>
                          )}
                          {cell.win !== 0 && cell.win !== false && (
                            <span className="absolute bottom-0 text-[10px] text-yellow-400 font-bold">
                              win
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultTable;
