import React from "react";
import { CombatantIcon, Team } from "../../Combatant";
import { Stack } from "../../Common";
import styles from "./SelectableTeam.module.css";

export interface SelectableTeamProps {
  team: Team;
  onClick?: () => void;
}

export const SelectableTeam: React.FC<SelectableTeamProps> = ({
  team,
  onClick,
}) => {
  return (
    <div className={styles.wrapper} onClick={onClick}>
      <div className={styles.name}>{team.name}</div>
      <Stack gap={20}>
        {team.combatants.map((c) => (
          <div key={c.name} className={styles.iconWrapper}>
            <CombatantIcon combatant={c} teamColor={team.color} />
          </div>
        ))}
      </Stack>
    </div>
  );
};
