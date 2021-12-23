import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IdentifiedTeam, ReadonlyActiveTeam } from "../../Combatant";
import { GameManager } from "../GameManager";
import { GameSpecs } from "../gameSpecs";
import { useGameSpecs } from "../GameSpecsProvider";
import { useTeamSelection } from "../TeamSelectionProvider";

export function useManagerInstance() {
  const specs = useGameSpecs();
  const { selection, setSelection } = useTeamSelection();

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

  useEffect(() => {
    if (!selection) {
      setGameManager(undefined);
    } else {
      setGameManager(new GameManager(specs, selection.left, selection.right));
    }
  }, [selection, specs]);

  const updateState = useCallback(() => {
    setLeftTeam(gameManager?.getLeftTeam());
    setRightTeam(gameManager?.getRightTeam());
    setCurrentTick(gameManager?.getCurrentTick());
    setVictor(gameManager?.getVictor());
  }, [gameManager]);

  useEffect(() => {
    updateState();

    gameManager?.setOnChange(() => {
      updateState();
    });

    return () => gameManager?.clearOnChange();
  }, [gameManager, updateState]);

  const clearGame = useCallback(() => {
    setSelection(undefined);
  }, []);

  const startGame = useCallback(
    (left: IdentifiedTeam, right: IdentifiedTeam) => {
      setSelection({ left, right });
    },
    []
  );

  const restartGame = useCallback(() => {
    if (selection) {
      setSelection({ left: selection.left, right: selection.right });
    }
  }, [selection]);

  return {
    gameManager,
    leftTeam,
    rightTeam,
    currentTick,
    victor,
    teams,
    entrants,
    startGame,
    clearGame,
    restartGame,
  };
}
