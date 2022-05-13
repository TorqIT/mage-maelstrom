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

export const CombatantIcon = React.memo<CombatantIconProps>(
  ({ name, color, icon, horizontalFlip, size }) => {
    return (
      <div style={size ? { width: size, height: size } : {}}>
        <Tooltip content={name}>
          <div className={styles.iconWrapper} style={{ borderColor: color }}>
            <Stack fill>
              <div
                style={{
                  width: size && size - 4,
                  height: size && size - 4,
                  overflow: "hidden",
                }}
              >
                <img
                  className={classNames(styles.icon, {
                    [styles.flip]: horizontalFlip,
                  })}
                  src={icon}
                  alt={name}
                  style={{
                    backgroundColor: "white",
                    maxWidth: size && size - 4,
                    maxHeight: size && size - 4,
                    objectFit: "cover",
                  }}
                ></img>
              </div>
            </Stack>
          </div>
        </Tooltip>
      </div>
    );
  }
);
