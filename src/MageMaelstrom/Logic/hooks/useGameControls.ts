import { useCallback, useEffect, useState } from "react";
import { CombatantSubclass, IdentifiedTeam } from "../../Combatant";
import { GameManager } from "../GameManager";

export function useGameControls(
  gameManager: GameManager | undefined,
  hasVictor: boolean
) {
  const startGame = useCallback(
    (leftTeam: IdentifiedTeam, rightTeam: IdentifiedTeam) => {
      gameManager?.startGame(leftTeam, rightTeam);
    },
    [gameManager]
  );

  const tick = useCallback(() => {
    gameManager?.tick(true);
  }, [gameManager]);

  const tickUntilNextAction = useCallback(() => {
    gameManager?.tickUntilNextAction();
  }, [gameManager]);

  const [isLooping, setLooping] = useState(false);

  useEffect(() => {
    if (hasVictor) {
      setLooping(false);
    }
  }, [hasVictor]);

  useEffect(() => {
    if (!isLooping) {
      return;
    }

    const timer = setInterval(() => {
      tickUntilNextAction();
    }, 100);

    return () => clearInterval(timer);
  }, [isLooping, tickUntilNextAction]);

  const toggleLooping = useCallback(() => {
    setLooping(!isLooping);
  }, [isLooping]);

  const buildCombatant = useCallback(
    (SubCombatant: CombatantSubclass) =>
      gameManager?.buildCombatant(SubCombatant),
    [gameManager]
  );

  return {
    startGame,
    tick,
    tickUntilNextAction,
    toggleLooping,
    buildCombatant,
    isLooping,
  };
}
