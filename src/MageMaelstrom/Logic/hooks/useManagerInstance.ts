import { useEffect, useState } from "react";
import { ReadonlyActiveTeam } from "../../Combatant";
import { GameManager } from "../GameManager";
import { GameSpecs } from "../gameSpecs";
import { BattleLogEvent } from "../logs";

export function useManagerInstance(specs: GameSpecs) {
  const [gameManager, setGameManager] = useState<GameManager>();

  const [leftTeam, setLeftTeam] = useState<ReadonlyActiveTeam>();
  const [rightTeam, setRightTeam] = useState<ReadonlyActiveTeam>();
  const [currentTick, setCurrentTick] = useState<number>();
  const [victor, setVictor] = useState<ReadonlyActiveTeam | null>();
  const [logs, setLogs] = useState<BattleLogEvent[]>([]);

  useEffect(() => {
    setGameManager(new GameManager(specs));

    setLeftTeam(undefined);
    setRightTeam(undefined);
    setCurrentTick(-1);
    setVictor(undefined);
    setLogs([]);
  }, [specs]);

  useEffect(() => {
    gameManager?.setOnChange(() => {
      setLeftTeam(gameManager.getLeftTeam());
      setRightTeam(gameManager.getRightTeam());
      setCurrentTick(gameManager.getCurrentTick());
      setVictor(gameManager.getVictor());
      setLogs(gameManager.getLogs());
    });

    return () => gameManager?.clearOnChange();
  }, [gameManager]);

  return { gameManager, leftTeam, rightTeam, currentTick, victor, logs };
}
