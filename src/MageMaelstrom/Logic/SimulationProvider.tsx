import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useGameManager } from ".";
import { loggingManager } from "../Logging";
import { GameManager } from "./GameManager";
import { useGameSpecs } from "./GameSpecsProvider";
import { useTeamSelection } from "./TeamSelectionProvider";

function sleep(millis: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, millis));
}

export interface SimulationData {
  leftWins: number;
  rightWins: number;
  draws: number;
  isSimulating: boolean;
  simulateManyGames: () => void;
}

const SimulationContext = createContext<SimulationData | null>(null);

export interface SimulationProviderProps {}

export const SimulationProvider: React.FC<SimulationProviderProps> = ({
  children,
}) => {
  const specs = useGameSpecs();
  const { selection } = useTeamSelection();

  const [leftWins, setLeftWins] = useState(0);
  const [rightWins, setRightWins] = useState(0);
  const [draws, setDraws] = useState(0);

  const [isSimulating, setSimulating] = useState(false);

  const simulateManyGames = useCallback(async () => {
    if (!selection) {
      return;
    }

    setLeftWins(0);
    setRightWins(0);
    setDraws(0);
    setSimulating(true);
    loggingManager.setEnabled(false);

    let l = 0;
    let r = 0;
    let d = 0;

    for (let j = 0; j < 200; j++) {
      await sleep(10);

      const gameManager = new GameManager(
        specs,
        selection.left,
        selection.right
      );

      while (!gameManager.isFinished()) {
        gameManager.tick(false);
      }

      const victor = gameManager.getVictor();

      if (victor === null) {
        setDraws(++d);
      } else if (!victor?.flip) {
        setLeftWins(++l);
      } else {
        setRightWins(++r);
      }
    }

    setSimulating(false);
    loggingManager.setEnabled(true);
  }, [selection, specs]);

  return (
    <SimulationContext.Provider
      value={{ leftWins, rightWins, draws, isSimulating, simulateManyGames }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export function useSimulation() {
  const result = useContext(SimulationContext);

  if (result === null) {
    throw new Error(
      "useSimulation() cannot be used without being wrapped by a SimulationProvider"
    );
  }

  return result;
}
