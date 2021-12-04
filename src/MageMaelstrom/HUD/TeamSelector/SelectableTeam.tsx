import classNames from "classnames";
import React from "react";
import { CombatantIcon, IdentifiedTeam } from "../../Combatant";
import { Stack, Tooltip } from "../../Common";
import styles from "./SelectableTeam.module.css";

export interface SelectableTeamProps {
  team: IdentifiedTeam;
  errors?: string[];
  onClick?: () => void;
}

export const SelectableTeam: React.FC<SelectableTeamProps> = ({
  team,
  errors,
  onClick,
}) => {
  const isSelectable = errors == null || errors?.length === 0;

  return (
    <Tooltip
      content={
        <ul style={{ paddingLeft: 20 }}>
          {errors?.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      }
      disabled={isSelectable}
    >
      <div
        className={classNames(styles.wrapper, {
          [styles.disabled]: !isSelectable,
        })}
        onClick={isSelectable ? onClick : undefined}
      >
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
