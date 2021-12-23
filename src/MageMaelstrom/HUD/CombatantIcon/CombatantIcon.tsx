import classNames from "classnames";
import React from "react";
import { Stack, Tooltip } from "../../Common";
import { CombatantInfo } from "../../Logic";
import styles from "./CombatantIcon.module.css";

export interface CombatantIconProps {
  name: string;
  icon: string;
  color: string;
  horizontalFlip?: boolean;
  size?: number;
}

export const CombatantIcon: React.FC<CombatantIconProps> = ({
  name,
  color,
  icon,
  horizontalFlip,
  size,
}) => {
  return (
    <div style={size ? { width: size, height: size } : {}}>
      <div className={styles.iconWrapper} style={{ borderColor: color }}>
        <Stack fill>
          <img
            className={classNames(styles.icon, {
              [styles.flip]: horizontalFlip,
            })}
            src={icon}
            alt={name}
            width={size}
            height={size}
          ></img>
        </Stack>
      </div>
    </div>
  );
};
