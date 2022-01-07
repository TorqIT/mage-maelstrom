import React from "react";
import { Stack } from "../../../Common";
import { Icon, mmAttack, mmCrit } from "../../../Common/Icon";
import { AttackLog } from "../../../Logging/logs";
import { CombatantIcon } from "../../CombatantIcon";
import styles from "./LogDisplay.module.css";

export interface AttackLogDisplayProps {
  log: AttackLog;
}

export const AttackLogDisplay = React.memo<AttackLogDisplayProps>(({ log }) => {
  return (
    <Stack gap={10} alignment="middle">
      <CombatantIcon {...log.attacker} size={32} />
      <Icon icon={log.isCrit ? mmCrit : mmAttack} size={28} />
      <span className={styles.tiny}>(-{Math.round(log.damage)})</span>
      <CombatantIcon {...log.target} horizontalFlip={true} size={32} />
      <span>{Math.max(0, Math.ceil(log.remainingHealth))} </span>
    </Stack>
  );
});
