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
  const [gameManager, setGameManager] = useState<GameManager>();

  const [leftTeam, setLeftTeam] = useState<ReadonlyActiveTeam>();
  const [rightTeam, setRightTeam] = useState<ReadonlyActiveTeam>();
  const [currentTick, setCurrentTick] = useState<number>();

  useEffect(() => {
    setGameManager(new GameManager(specs));

    setLeftTeam(undefined);
    setRightTeam(undefined);
    setCurrentTick(-1);
  }, [specs]);

  const startGame = useCallback(
    (leftTeam: IdentifiedTeam, rightTeam: IdentifiedTeam) => {
      gameManager?.startGame(leftTeam, rightTeam);

      setLeftTeam(gameManager?.getLeftTeam());
      setRightTeam(gameManager?.getRightTeam());
      setCurrentTick(gameManager?.getCurrentTick());
    },
    [gameManager]
  );

  const tick = useCallback(() => {
    const change = gameManager?.tick();

    if (change) {
      setLeftTeam(gameManager?.getLeftTeam());
      setRightTeam(gameManager?.getRightTeam());
    }

    setCurrentTick(gameManager?.getCurrentTick());
  }, [gameManager]);

  const tickUntilNextAction = useCallback(() => {
    gameManager?.tickUntilNextAction();
    setLeftTeam(gameManager?.getLeftTeam());
    setRightTeam(gameManager?.getRightTeam());
    setCurrentTick(gameManager?.getCurrentTick());
  }, [gameManager]);

  const [shouldLoop, setShouldLoop] = useState(false);

  useEffect(() => {
    if (!shouldLoop) {
      return;
    }

    const timer = setInterval(() => {
      tickUntilNextAction();
    }, 100);

    return () => clearInterval(timer);
  }, [shouldLoop, tickUntilNextAction]);

  const toggleLooping = useCallback(() => {
    setShouldLoop(!shouldLoop);
  }, [shouldLoop]);

  const buildCombatant = useCallback(
    (SubCombatant: CombatantSubclass) =>
      gameManager?.buildCombatant(SubCombatant),
    [gameManager]
  );

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
