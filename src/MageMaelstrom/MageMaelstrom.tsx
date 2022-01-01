import React from "react";
import { Battle } from "./HUD/Battle/Battle";
import { Team } from "./Combatant";
import { TeamSelector } from "./HUD";
import { useGameManager } from "./Logic";
import styles from "./MageMaelstrom.module.css";

export interface MageMaelstromProps {}

export const MageMaelstrom: React.FC<MageMaelstromProps> = ({}) => {
  const { leftTeam, rightTeam } = useGameManager();

  return (
    <div id={styles.mageMaelstrom}>
      <div>
        {(!leftTeam || !rightTeam) && <TeamSelector />}
        {leftTeam && rightTeam && <Battle />}
      </div>
    </div>
  );
};
