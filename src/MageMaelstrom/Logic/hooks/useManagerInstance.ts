import { useEffect, useState } from "react";
import { ReadonlyActiveTeam } from "../../Combatant";
import { GameManager } from "../GameManager";
import { GameSpecs } from "../gameSpecs";

export function useManagerInstance(specs: GameSpecs) {
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

  useEffect(() => {
    gameManager?.setOnChange(() => {
      setLeftTeam(gameManager.getLeftTeam());
      setRightTeam(gameManager.getRightTeam());
      setCurrentTick(gameManager.getCurrentTick());
    });

    return () => gameManager?.clearOnChange();
  }, [gameManager]);

  return { gameManager, leftTeam, rightTeam, currentTick };
}
