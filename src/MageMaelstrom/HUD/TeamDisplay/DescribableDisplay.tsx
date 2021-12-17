import React from "react";
import { Describable, ExtendedSpellStatus } from "../../Combatant";
import { Stack, Tooltip } from "../../Common";
import { Icon, mmCooldownTimer, mmManaCost } from "../../Common/Icon";
import styles from "./DescribableDisplay.module.css";

function isSpell(describable: Describable): describable is ExtendedSpellStatus {
  return (describable as ExtendedSpellStatus).cooldown != null;
}

export interface DescribableDisplayProps {
  describable: Describable;
  fade?: boolean;
}

export const DescribableDisplay: React.FC<DescribableDisplayProps> = ({
  describable,
  fade,
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
          {isSpell(describable) && (
            <Stack gap={20} className={styles.spellCost}>
              <Stack alignment="middle" gap={4}>
                <Icon icon={mmCooldownTimer} size={20} />
                {describable.cooldown}
              </Stack>
              <Stack alignment="middle" gap={4}>
                <Icon icon={mmManaCost} size={20} />
                {describable.manaCost}
              </Stack>
            </Stack>
          )}
          {describable.flavorText && (
            <div className={styles.flavorText}>{describable.flavorText}</div>
          )}
        </div>
      }
    >
      <div style={{ opacity: fade ? 0.4 : 1, cursor: "help" }}>
        <Icon icon={describable.icon} size={28} />
      </div>
    </Tooltip>
  );
};
