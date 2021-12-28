import React from "react";
import { Stack } from "../../../Common";
import { Icon } from "../../../Common/Icon";
import { SpellLog } from "../../../Logging/logs";
import { CombatantIcon } from "../../CombatantIcon";
import styles from "./LogDisplay.module.css";

export interface SpellLogDisplayProps {
  log: SpellLog;
}

export const SpellLogDisplay = React.memo<SpellLogDisplayProps>(({ log }) => {
  return (
    <Stack gap={10} alignment="middle">
      <CombatantIcon {...log.attacker} size={32} />
      <Icon icon={log.spellIcon} size={28} />
      {log.damage && <span className={styles.tiny}>({-log.damage})</span>}
      {log.target && (
        <CombatantIcon {...log.target} horizontalFlip={true} size={32} />
      )}
      {log.remainingHealth && (
        <span>{Math.max(0, Math.ceil(log.remainingHealth))} </span>
      )}
    </Stack>
  );
});
