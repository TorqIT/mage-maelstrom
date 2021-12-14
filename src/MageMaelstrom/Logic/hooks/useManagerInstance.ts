import { useCallback, useEffect, useMemo, useState } from "react";
import { ReadonlyActiveTeam } from "../../Combatant";
import { GameManager } from "../GameManager";
import { GameSpecs } from "../gameSpecs";

export function useManagerInstance(specs: GameSpecs) {
  const [gameManager, setGameManager] = useState<GameManager>();

  const [leftTeam, setLeftTeam] = useState<ReadonlyActiveTeam>();
  const [rightTeam, setRightTeam] = useState<ReadonlyActiveTeam>();
  const [currentTick, setCurrentTick] = useState<number>();
  const [victor, setVictor] = useState<ReadonlyActiveTeam | null>();

  const teams = useMemo(
    () => (leftTeam && rightTeam ? [leftTeam, rightTeam] : []),
    [leftTeam, rightTeam]
  );
  const entrants = useMemo(
    () =>
      leftTeam && rightTeam
        ? [leftTeam?.entrants, rightTeam?.entrants].flat()
        : [],
    [leftTeam, rightTeam]
  );

  const doFullReset = useCallback(() => {
    setGameManager(new GameManager(specs));

    setLeftTeam(undefined);
    setRightTeam(undefined);
    setCurrentTick(-1);
    setVictor(undefined);
  }, [specs]);

  useEffect(() => {
    doFullReset();
  }, [doFullReset]);

  useEffect(() => {
    gameManager?.setOnChange(() => {
      setLeftTeam(gameManager.getLeftTeam());
      setRightTeam(gameManager.getRightTeam());
      setCurrentTick(gameManager.getCurrentTick());
      setVictor(gameManager.getVictor());
    });

    return () => gameManager?.clearOnChange();
  }, [gameManager]);

  return {
    gameManager,
    leftTeam,
    rightTeam,
    currentTick,
    victor,
    doFullReset,
    teams,
    entrants,
  };
}
