import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ActiveTeam, Team } from "../Combatant";
import { GameManager } from "./GameManager";

export interface GameManagerData extends GameManagerProviderProps {
  leftTeam?: ActiveTeam;
  rightTeam?: ActiveTeam;
  startGame: (leftTeam: Team, rightTeam: Team) => void;
}

const GameManagerContext = createContext<GameManagerData | null>(null);

export interface GameManagerProviderProps {
  arenaWidth: number;
  arenaHeight: number;
}

export const GameManagerProvider: React.FC<GameManagerProviderProps> = ({
  arenaWidth,
  arenaHeight,
  children,
}) => {
  const [gameManager, setGameManager] = useState<GameManager>();

  useEffect(() => {
    setGameManager(new GameManager(arenaWidth, arenaHeight));
  }, [arenaWidth, arenaHeight]);

  const [leftTeam, setLeftTeam] = useState<ActiveTeam>();
  const [rightTeam, setRightTeam] = useState<ActiveTeam>();

  const startGame = useCallback(
    (leftTeam: Team, rightTeam: Team) => {
      gameManager?.startGame(leftTeam, rightTeam);

      setLeftTeam(gameManager?.getLeftTeam());
      setRightTeam(gameManager?.getRightTeam());
    },
    [gameManager]
  );

  return (
    <GameManagerContext.Provider
      value={{ leftTeam, rightTeam, startGame, arenaWidth, arenaHeight }}
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
