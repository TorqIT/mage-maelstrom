import { createContext, useContext } from "react";
import { GameSpecs } from "./gameSpecs";

export interface GameSpecsData {
  specs: GameSpecs;
}

const GameSpecsContext = createContext<GameSpecs | null>(null);

export const GameSpecsProvider: React.FC<GameSpecsData> = ({
  specs,
  children,
}) => {
  return (
    <GameSpecsContext.Provider value={specs}>
      {children}
    </GameSpecsContext.Provider>
  );
};

export function useGameSpecs() {
  const result = useContext(GameSpecsContext);

  if (result === null) {
    throw new Error(
      "useGameSpecs() cannot be used without being wrapped by a GameSpecsProvider"
    );
  }

  return result;
}
