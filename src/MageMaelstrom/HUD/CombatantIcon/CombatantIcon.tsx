import classNames from "classnames";
import React from "react";
import { CombatantDefinition } from "../../Combatant";
import { Stack, Tooltip } from "../../Common";
import styles from "./CombatantIcon.module.css";

export interface CombatantIconProps {
  combatant?: CombatantDefinition;
  teamColor: string;
  horizontalFlip?: boolean;
  size?: number;
}

export const CombatantIcon: React.FC<CombatantIconProps> = ({
  combatant,
  teamColor,
  horizontalFlip,
  size,
}) => {
  return (
    <div style={size ? { width: size, height: size } : {}}>
      <Tooltip content={combatant?.name}>
        <div className={styles.iconWrapper} style={{ borderColor: teamColor }}>
          <Stack fill>
            <img
              className={classNames(styles.icon, {
                [styles.flip]: horizontalFlip,
              })}
              src={combatant?.icon}
              alt={combatant?.name}
              width={size}
              height={size}
            ></img>
          </Stack>
        </div>
      </Tooltip>
    </div>
  );
};
