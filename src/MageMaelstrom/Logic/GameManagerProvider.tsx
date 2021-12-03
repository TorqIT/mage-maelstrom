import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ActiveTeam, IdentifiedTeam, Team } from "../Combatant";
import { GameManager } from "./GameManager";
import { GameSpecs } from "./gameSpecs";

export interface GameManagerData extends GameManagerProviderProps {
  leftTeam?: ActiveTeam;
  rightTeam?: ActiveTeam;
  currentTick?: number;
  startGame: (leftTeam: IdentifiedTeam, rightTeam: IdentifiedTeam) => void;
  tick: () => void;
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

  useEffect(() => {
    setGameManager(new GameManager(specs));
  }, [specs]);

  const [leftTeam, setLeftTeam] = useState<ActiveTeam>();
  const [rightTeam, setRightTeam] = useState<ActiveTeam>();
  const [currentTick, setCurrentTick] = useState<number>();

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

  const [shouldLoop, setShouldLoop] = useState(false);

  useEffect(() => {
    if (!shouldLoop) {
      return;
    }

    const timer = setInterval(() => {
      tick();
    }, 0);

    return () => clearInterval(timer);
  }, [shouldLoop, tick]);

  const toggleLooping = useCallback(() => {
    setShouldLoop(!shouldLoop);
  }, [shouldLoop]);

  return (
    <GameManagerContext.Provider
      value={{
        leftTeam,
        rightTeam,
        startGame,
        specs,
        tick,
        currentTick,
        toggleLooping,
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
