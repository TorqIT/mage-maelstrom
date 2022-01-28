import { createContext, useContext } from "react";
import {
  IdentifiedTeam,
  ReadonlyActiveTeam,
  ReadonlyEntrant,
} from "../Combatant";
import { GameSpecs } from "./gameSpecs";
import { useGameControls } from "./hooks/useGameControls";
import { useManagerInstance } from "./hooks/useManagerInstance";

export interface GameManagerData extends GameManagerProviderProps {
  leftTeam?: ReadonlyActiveTeam;
  rightTeam?: ReadonlyActiveTeam;
  teams: ReadonlyActiveTeam[];
  entrants: ReadonlyEntrant[];
  victor?: ReadonlyActiveTeam | null;
  currentTick?: number;
  isLooping: boolean;
  gameSpeed: number;
  setGameSpeed: React.Dispatch<React.SetStateAction<number>>;
  tick: () => void;
  toggleLooping: () => void;
  simulate: (ticks: number) => void;
  simulateFullGame: () => void;
}

const GameManagerContext = createContext<GameManagerData | null>(null);

export interface GameManagerProviderProps {}

export const GameManagerProvider: React.FC<GameManagerProviderProps> = ({
  children,
}) => {
  const {
    gameManager,
    leftTeam,
    rightTeam,
    currentTick,
    victor,
    teams,
    entrants,
  } = useManagerInstance();
  const {
    tick,
    toggleLooping,
    isLooping,
    gameSpeed,
    setGameSpeed,
    simulate,
    simulateFullGame,
  } = useGameControls(gameManager, victor !== undefined);

  return (
    <GameManagerContext.Provider
      value={{
        leftTeam,
        rightTeam,
        victor,
        tick,
        isLooping,
        currentTick,
        toggleLooping,
        teams,
        entrants,
        gameSpeed,
        setGameSpeed,
        simulate,
        simulateFullGame,
      }}
    >
      {children}
    </GameManagerContext.Provider>
  );
};

export function useGameManager() {
  const result = useContext(GameManagerContext);

  if (result === null) {
    throw new Error(
      "useGameManager() cannot be used without being wrapped by a GameManagerProvider"
    );
  }

  return result;
}
