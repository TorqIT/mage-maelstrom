import React from "react";
import { AbilityStatus, ExtendedSpellStatus } from "../../Combatant";
import { Stack, Tooltip } from "../../Common";
import { Icon, mmCooldownTimer, mmManaCost } from "../../Common/Icon";
import styles from "./AbilityDisplay.module.css";

function isSpell(
  ability: AbilityStatus | ExtendedSpellStatus
): ability is ExtendedSpellStatus {
  return (ability as ExtendedSpellStatus).cooldown != null;
}

export interface AbilityDisplayProps {
  ability: AbilityStatus | ExtendedSpellStatus;
  fade?: boolean;
}

export const AbilityDisplay: React.FC<AbilityDisplayProps> = ({
  ability,
  fade,
}) => {
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
          {isSpell(ability) && (
            <Stack gap={20} className={styles.spellCost}>
              <Stack alignment="middle" gap={4}>
                <Icon icon={mmCooldownTimer} size={20} />
                {ability.cooldown}
              </Stack>
              <Stack alignment="middle" gap={4}>
                <Icon icon={mmManaCost} size={20} />
                {ability.manaCost}
              </Stack>
            </Stack>
          )}
          {ability.flavorText && (
            <div className={styles.flavorText}>{ability.flavorText}</div>
          )}
        </div>
      }
    >
      <div style={{ opacity: fade ? 0.4 : 1, cursor: "help" }}>
        <Icon icon={ability.icon} size={28} />
      </div>
    </Tooltip>
  );
};
