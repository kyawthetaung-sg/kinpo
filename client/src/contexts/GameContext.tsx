import React, { createContext, useContext, useState } from "react";

interface GameContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const GameContext = createContext<GameContextType>({
  refreshKey: 0,
  triggerRefresh: () => {},
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <GameContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
