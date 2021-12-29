import { useCallback, useEffect, useState } from "react";
import { CombatantSubclass } from "../../Combatant";
import { GameManager } from "../GameManager";

export function useGameControls(
  gameManager: GameManager | undefined,
  hasVictor: boolean
) {
  const tick = useCallback(() => {
    if (!hasVictor) {
      gameManager?.tick(true);
    }
  }, [gameManager, hasVictor]);

  const [isLooping, setLooping] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1);

  useEffect(() => {
    if (hasVictor) {
      setLooping(false);
    }
  }, [hasVictor]);

  useEffect(() => {
    setLooping(false);
  }, [gameManager]);

  useEffect(() => {
    if (!isLooping) {
      return;
    }

    let timer: NodeJS.Timeout;

    if (gameSpeed > 1 / 3) {
      const ticksPerInterval = gameSpeed * 3;
      let ticksToPerform = 0;

      timer = setInterval(() => {
        ticksToPerform += ticksPerInterval;

        while (ticksToPerform > 0) {
          gameManager?.tick(ticksToPerform <= 1);
          ticksToPerform--;
        }
      }, 30);
    } else {
      timer = setInterval(() => {
        gameManager?.tick(true);
      }, Math.floor(30 / gameSpeed));
    }

    return () => clearInterval(timer);
  }, [gameManager, gameSpeed, isLooping, tick]);

  const toggleLooping = useCallback(() => {
    if (!hasVictor) {
      setLooping(!isLooping);
    }
  }, [hasVictor, isLooping]);

  return {
    tick,
    toggleLooping,
    isLooping,
    gameSpeed,
    setGameSpeed,
  };
}
