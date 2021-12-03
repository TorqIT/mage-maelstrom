import classNames from "classnames";
import React from "react";
import { Stack } from "../../Common";
import { Combatant } from "../combatant";
import styles from "./CombatantIcon.module.css";

export interface CombatantIconProps {
  combatant: Combatant<any>;
  teamColor: string;
  horizontalFlip?: boolean;
}

export const CombatantIcon: React.FC<CombatantIconProps> = ({
  combatant,
  teamColor,
  horizontalFlip,
}) => {
  return (
    <div className={styles.iconWrapper} style={{ borderColor: teamColor }}>
      <Stack fill>
        <img
          className={classNames(styles.icon, { [styles.flip]: horizontalFlip })}
          src={combatant.icon}
          alt={combatant.name}
        ></img>
      </Stack>
    </div>
  );
};
