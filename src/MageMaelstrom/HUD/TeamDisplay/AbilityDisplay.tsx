import React from "react";
import { AbilityStatus } from "../../Combatant";
import { Stack, Tooltip } from "../../Common";
import { Icon } from "../../Common/Icon";
import styles from "./AbilityDisplay.module.css";

export interface AbilityDisplayProps {
  ability: AbilityStatus;
}

export const AbilityDisplay: React.FC<AbilityDisplayProps> = ({ ability }) => {
  return (
    <Tooltip
      content={
        <div className={styles.wrapper}>
          <Stack>
            <Stack gap={10} alignment="middle">
              <Icon icon={ability.icon} size={36} />
              <div className={styles.name}>{ability.name}</div>
            </Stack>
          </Stack>

          <div className={styles.description}>{ability.description}</div>
          {ability.flavorText && (
            <div className={styles.flavorText}>{ability.flavorText}</div>
          )}
        </div>
      }
    >
      <Icon icon={ability.icon} size={28} />
    </Tooltip>
  );
};
