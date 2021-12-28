import React from "react";
import { DescriptiveIcon } from "../../Combatant";
import { Stack, Tooltip } from "../../Common";
import { Icon, mmCooldownTimer, mmManaCost } from "../../Common/Icon";
import styles from "./DescribableDisplay.module.css";

export interface DescribableDisplayProps {
  describable: DescriptiveIcon;
  fade?: boolean;
  cooldown?: number;
  manaCost?: number;
}

export const DescribableDisplay: React.FC<DescribableDisplayProps> = ({
  describable,
  fade,
  cooldown,
  manaCost,
}) => {
  return (
    <Tooltip
      content={
        <div className={styles.wrapper}>
          <Stack>
            <Stack gap={10} alignment="middle">
              <Icon icon={describable.icon} size={36} />
              <div className={styles.name}>{describable.name}</div>
            </Stack>
          </Stack>

          <div className={styles.description}>{describable.description}</div>
          {(cooldown || manaCost) && (
            <Stack gap={20} className={styles.spellCost}>
              {cooldown && (
                <Stack alignment="middle" gap={4}>
                  <Icon icon={mmCooldownTimer} size={20} />
                  {cooldown}
                </Stack>
              )}
              {manaCost && (
                <Stack alignment="middle" gap={4}>
                  <Icon icon={mmManaCost} size={20} />
                  {manaCost}
                </Stack>
              )}
            </Stack>
          )}
          {describable.flavorText && (
            <div className={styles.flavorText}>{describable.flavorText}</div>
          )}
        </div>
      }
    >
      <div style={{ opacity: fade ? 0.4 : 1, cursor: "help" }}>
        <Icon icon={describable.icon} size={24} />
      </div>
    </Tooltip>
  );
};
