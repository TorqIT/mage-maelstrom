import { useCallback, useEffect, useState } from "react";
import { CombatantSubclass, IdentifiedTeam } from "../../Combatant";
import { GameManager } from "../GameManager";

const TICKS_PER_LOOP = 3;

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
    if (!hasVictor) {
      gameManager?.tick(true);
    }
  }, [gameManager, hasVictor]);

  const tickUntilNextAction = useCallback(() => {
    if (!hasVictor) {
      gameManager?.tickUntilNextAction();
    }
  }, [gameManager, hasVictor]);

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
      for (let j = 0; j < TICKS_PER_LOOP; j++) {
        gameManager?.tick(j === TICKS_PER_LOOP - 1);
      }
    }, TICKS_PER_LOOP * 10);

    return () => clearInterval(timer);
  }, [gameManager, isLooping, tick]);

  const toggleLooping = useCallback(() => {
    if (!hasVictor) {
      setLooping(!isLooping);
    }
  }, [hasVictor, isLooping]);

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
