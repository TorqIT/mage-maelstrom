import React from "react";
import { ReadonlyActiveTeam } from "../../Combatant";
import { EntrantDisplay } from "./EntrantDisplay";
import styles from "./TeamDisplay.module.css";

export interface TeamDisplayProps {
  team: ReadonlyActiveTeam;
}

export const TeamDisplay: React.FC<TeamDisplayProps> = ({ team }) => {
  return (
    <div className={styles.wrapper}>
      {team.entrants.map((e) => (
        <EntrantDisplay
          key={e.status.id}
          entrant={e}
          color={team.color}
          flip={team.flip}
        />
      ))}
    </div>
  );
};
