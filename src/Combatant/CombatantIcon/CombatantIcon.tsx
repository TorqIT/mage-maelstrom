import React from "react";
import { Stack } from "../../Common";
import { Combatant } from "../combatant";
import styles from "./CombatantIcon.module.css";

export interface CombatantIconProps {
  combatant: Combatant;
  teamColor: string;
}

export const CombatantIcon: React.FC<CombatantIconProps> = ({
  combatant,
  teamColor,
}) => {
  return (
    <div className={styles.iconWrapper} style={{ borderColor: teamColor }}>
      <Stack fill>
        <img
          className={styles.icon}
          src={combatant.icon}
          alt={combatant.name}
        ></img>
      </Stack>
    </div>
  );
};
