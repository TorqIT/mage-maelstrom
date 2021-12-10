import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Combatant,
  CombatantSubclass,
  IdentifiedTeam,
  ReadonlyActiveTeam,
} from "../Combatant";
import { GameManager } from "./GameManager";
import { GameSpecs } from "./gameSpecs";
import { useGameControls } from "./hooks/useGameControls";
import { useManagerInstance } from "./hooks/useManagerInstance";

export interface GameManagerData extends GameManagerProviderProps {
  leftTeam?: ReadonlyActiveTeam;
  rightTeam?: ReadonlyActiveTeam;
  currentTick?: number;
  buildCombatant: (SubCombatant: CombatantSubclass) => Combatant | undefined;
  startGame: (leftTeam: IdentifiedTeam, rightTeam: IdentifiedTeam) => void;
  tick: () => void;
  tickUntilNextAction: () => void;
  toggleLooping: () => void;
}

const GameManagerContext = createContext<GameManagerData | null>(null);

export interface GameManagerProviderProps {
  specs: GameSpecs;
}

export const GameManagerProvider: React.FC<GameManagerProviderProps> = ({
  specs,
  children,
}) => {
  const { gameManager, leftTeam, rightTeam, currentTick } =
    useManagerInstance(specs);
  const {
    startGame,
    tick,
    toggleLooping,
    tickUntilNextAction,
    buildCombatant,
  } = useGameControls(gameManager);

  return (
    <GameManagerContext.Provider
      value={{
        leftTeam,
        rightTeam,
        startGame,
        specs,
        tick,
        tickUntilNextAction,
        currentTick,
        toggleLooping,
        buildCombatant,
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
