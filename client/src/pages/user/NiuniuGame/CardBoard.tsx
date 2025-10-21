import { useEffect, useState } from "react";
import { createNiuniuResult } from "@/api/niuniuResult";
import { useGameContext } from "@/contexts/GameContext";

const suits = ["♠", "♥", "♣", "♦"];
const ranks = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

interface CardType {
  suit: string;
  rank: string;
  value: number;
}
interface Player {
  name: string;
  cards: CardType[];
  result: string;
}

const getCardValue = (rank: string) => {
  if (["J", "Q", "K"].includes(rank)) return 10;
  if (rank === "A") return 1;
  return parseInt(rank);
};

const generateDeck = (): CardType[] => {
  const deck: CardType[] = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank, value: getCardValue(rank) });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
};

const calculateNiuniu = (cards: CardType[]) => {
  if (cards.length < 5) return "";
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 4; j++) {
      for (let k = j + 1; k < 5; k++) {
        const sum = cards[i].value + cards[j].value + cards[k].value;
        if (sum % 10 === 0) {
          const rest = cards
            .filter((_, idx) => ![i, j, k].includes(idx))
            .reduce((a, b) => a + b.value, 0);
          const niuValue = rest % 10;
          return niuValue === 0 ? "牛牛" : `牛${niuValue}`;
        }
      }
    }
  }
  return "无牛";
};

const CardBoard = () => {
  const { triggerRefresh } = useGameContext();
  const [deck, setDeck] = useState<CardType[]>(generateDeck());
  const [players, setPlayers] = useState<Player[]>([
    { name: "庄", cards: [], result: "" },
    { name: "闲1", cards: [], result: "" },
    { name: "闲2", cards: [], result: "" },
    { name: "闲3", cards: [], result: "" },
  ]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [round, setRound] = useState(0);
  const [status, setStatus] = useState<"initial" | "deal" | "payout">(
    "initial"
  );
  const [timer, setTimer] = useState(30);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    if (status !== "initial") return;
    if (timer <= 0) {
      setStatus("deal");
      setShowCards(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, status]);

  useEffect(() => {
    if (status !== "deal") return;
    if (round >= 5) {
      setStatus("payout");
      return;
    }

    const dealInterval = setInterval(() => {
      dealOneCard();
    }, 2000);

    return () => clearInterval(dealInterval);
  }, [status, round, currentTurn]);

  useEffect(() => {
    if (status !== "payout") return;
    const payoutTimer = setTimeout(() => {
      resetGame();
      setStatus("initial");
      setTimer(30);
      setShowCards(false);
    }, 30000);
    return () => clearTimeout(payoutTimer);
  }, [status]);

  const dealOneCard = async () => {
    if (deck.length === 0 || round >= 5) return;

    const newDeck = [...deck];
    const newPlayers = [...players];
    const card = newDeck.shift()!;
    newPlayers[currentTurn].cards.push(card);

    if (newPlayers[currentTurn].cards.length === 5) {
      newPlayers[currentTurn].result = calculateNiuniu(
        newPlayers[currentTurn].cards
      );
    }

    let nextTurn = currentTurn + 1;
    let nextRound = round;
    if (nextTurn >= newPlayers.length) {
      nextTurn = 0;
      nextRound += 1;
    }

    const allDealt = newPlayers.every((p) => p.cards.length === 5);
    if (allDealt) {
      const payload = {
        banker: getResultValue(newPlayers[0].result),
        player1: getResultValue(newPlayers[1].result),
        player2: getResultValue(newPlayers[2].result),
        player3: getResultValue(newPlayers[3].result),
      };
      try {
        await createNiuniuResult(payload);
        triggerRefresh();
      } catch (err) {
        console.error("Failed to save niuniu result:", err);
      }
    }

    setPlayers(newPlayers);
    setDeck(newDeck);
    setCurrentTurn(nextTurn);
    setRound(nextRound);
  };

  const getResultValue = (result: string) => {
    if (result === "牛牛") return 10;
    if (result.startsWith("牛")) return parseInt(result.replace("牛", "")) || 0;
    return 0;
  };

  const resetGame = () => {
    setDeck(generateDeck());
    setPlayers([
      { name: "庄", cards: [], result: "" },
      { name: "闲1", cards: [], result: "" },
      { name: "闲2", cards: [], result: "" },
      { name: "闲3", cards: [], result: "" },
    ]);
    setCurrentTurn(0);
    setRound(0);
  };

  const statusName = () => {
    if (status === "initial") return timer;
    if (status === "deal") return "开牌";
    if (status === "payout") return "派彩";
  };

  return (
    <>
      <div className="fixed top-15 left-100 transform -translate-x-1/2 w-32 h-32 z-50">
        {status === "initial" ? (
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="48"
                stroke="rgba(0,0,0,0.8)"
                strokeWidth="6"
                fill="rgba(0,0,0,0.6)"
              />
              <circle
                cx="50%"
                cy="50%"
                r="48"
                stroke={`url(#gradientStroke)`}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray="301"
                strokeDashoffset={301 - (timer / 30) * 301}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
              <defs>
                <linearGradient id="gradientStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FF0000" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-white text-3xl font-bold">
              {timer}
            </span>
          </div>
        ) : (
          <div className="w-28 h-28 rounded-full bg-black/70 text-white flex items-center justify-center border border-black text-xl font-bold">
            {statusName()}
          </div>
        )}
      </div>

      {showCards && (
        <div className="flex flex-wrap justify-between gap-1 p-2 w-full bg-black/70">
          <div className="shadow-lg bg-transparent flex justify-center items-center border-none">
            <div className="border-3 border-green-500 rounded-xl p-1">
              <div className="w-18 bg-white border border-gray-600 rounded-lg flex items-center justify-center text-lg font-bold">
                <img
                  src="/images/card.jpeg"
                  alt="card-grid"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
          {players.map((player, idx) => (
            <div
              key={idx}
              className={`shadow-lg p-1 flex justify-center items-center ${
                player.name === "庄"
                  ? "border-none"
                  : "border-3 rounded-xl border-blue-500"
              }`}
            >
              <div
                className={`grid ${
                  player.name === "庄"
                    ? "grid-cols-6 border-3 border-red-500 p-2 rounded-xl"
                    : "grid-cols-3"
                } gap-2 justify-items-center`}
              >
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-18 h-24 border-none flex items-center justify-center text-lg font-bold"
                  >
                    {player.cards[i] && (
                      <div
                        className={`flex flex-col items-center bg-white border-1 w-full h-full rounded-lg ${
                          ["♥", "♦"].includes(player.cards[i].suit)
                            ? "text-red-500"
                            : "text-black"
                        }`}
                      >
                        <span>{player.cards[i].rank}</span>
                        <span>{player.cards[i].suit}</span>
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex flex-col items-center text-center font-bold text-xl">
                  <span
                    className={`${player.name === "庄" ? "text-red-500" : "text-blue-500"}`}
                  >
                    {player.name}
                  </span>
                  <span className="text-white mt-1">{player.result}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default CardBoard;
