import React from "react";
import { CombatantIcon, IdentifiedTeam } from "../../Combatant";
import { Stack, Tooltip } from "../../Common";
import styles from "./SelectableTeam.module.css";

export interface SelectableTeamProps {
  team: IdentifiedTeam;
  onClick?: () => void;
}

export const SelectableTeam: React.FC<SelectableTeamProps> = ({
  team,
  onClick,
}) => {
  return (
    <Tooltip content={"Test"} disabled>
      <div className={styles.wrapper} onClick={onClick}>
        <div className={styles.name}>{team.name}</div>
        <Stack gap={20}>
          {team.combatants.map((c) => (
            <div key={c.id} className={styles.iconWrapper}>
              <CombatantIcon combatant={c} teamColor={team.color} />
            </div>
          ))}
        </Stack>
      </div>
    </Tooltip>
  );
};
