import { createContext, useContext } from "react";
import {
  Combatant,
  CombatantSubclass,
  IdentifiedTeam,
  ReadonlyActiveTeam,
  ReadonlyEntrant,
} from "../Combatant";
import { GameSpecs } from "./gameSpecs";
import { useGameControls } from "./hooks/useGameControls";
import { useManagerInstance } from "./hooks/useManagerInstance";
import { BattleLogEvent } from "../Logging/logs";

export interface GameManagerData extends GameManagerProviderProps {
  leftTeam?: ReadonlyActiveTeam;
  rightTeam?: ReadonlyActiveTeam;
  teams: ReadonlyActiveTeam[];
  entrants: ReadonlyEntrant[];
  currentTick?: number;
  isLooping: boolean;
  buildCombatant: (SubCombatant: CombatantSubclass) => Combatant | undefined;
  startGame: (leftTeam: IdentifiedTeam, rightTeam: IdentifiedTeam) => void;
  doFullReset: () => void;
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
  const {
    gameManager,
    leftTeam,
    rightTeam,
    currentTick,
    victor,
    teams,
    entrants,
    doFullReset,
  } = useManagerInstance(specs);
  const {
    startGame,
    tick,
    toggleLooping,
    tickUntilNextAction,
    buildCombatant,
    isLooping,
  } = useGameControls(gameManager, victor !== undefined);

  return (
    <GameManagerContext.Provider
      value={{
        leftTeam,
        rightTeam,
        startGame,
        specs,
        tick,
        isLooping,
        tickUntilNextAction,
        currentTick,
        toggleLooping,
        buildCombatant,
        doFullReset,
        teams,
        entrants,
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
