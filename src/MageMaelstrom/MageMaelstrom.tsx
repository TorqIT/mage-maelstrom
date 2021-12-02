import React from "react";
import { Battle } from "./HUD/Battle/Battle";
import { Team } from "./Combatant";
import { TeamSelector } from "./HUD";
import { useGameManager } from "./Logic";
import styles from "./MageMaelstrom.module.css";

export interface MageMaelstromProps {
  teams: Team[];
}

export const MageMaelstrom: React.FC<MageMaelstromProps> = ({ teams }) => {
  const { leftTeam, rightTeam } = useGameManager();

  return (
    <div id={styles.mageMaelstrom}>
      <div>
        {(!leftTeam || !rightTeam) && <TeamSelector teams={teams} />}
        {leftTeam && rightTeam && <Battle />}
      </div>
    </div>
  );
};
