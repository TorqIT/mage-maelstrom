import React, { useMemo } from "react";
import { Stack } from "../../Common";
import { useGameManager } from "../../Logic";
import { AttackLog } from "../../Logic/logs";
import { CombatantIcon } from "../CombatantIcon";
import styles from "./LogDisplay.module.css";

export interface AttackLogDisplayProps {
  log: AttackLog;
}

export const AttackLogDisplay: React.FC<AttackLogDisplayProps> = ({ log }) => {
  const { entrants } = useGameManager();

  const attacker = useMemo(
    () => entrants.find((e) => e.status.id === log.attacker),
    [entrants, log.attacker]
  );
  const target = useMemo(
    () => entrants.find((e) => e.status.id === log.target),
    [entrants, log.target]
  );

  if (!attacker || !target) {
    return null;
  }

  return (
    <Stack gap={20} alignment="middle">
      <div className={styles.smallIcon}>
        <CombatantIcon
          combatant={attacker.combatant}
          teamColor={attacker.color}
        />
      </div>
      ⚔
      <div className={styles.smallIcon}>
        <CombatantIcon
          combatant={target.combatant}
          teamColor={target.color}
          horizontalFlip={true}
        />
      </div>
    </Stack>
  );
};
