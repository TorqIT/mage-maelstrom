import React from "react";
import { ActiveTeam } from "../../Combatant";
import { EntrantDisplay } from "./EntrantDisplay";
import styles from "./TeamDisplay.module.css";

export interface TeamDisplayProps {
  team: ActiveTeam;
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
