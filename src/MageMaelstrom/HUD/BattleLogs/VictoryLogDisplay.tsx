import React from "react";
import { Stack } from "../../Common";
import { VictoryLog } from "../../Logic/logs";
import { CombatantIcon } from "../CombatantIcon";
import styles from "./LogDisplay.module.css";

export interface VictoryLogDisplayProps {
  log: VictoryLog;
}

export const VictoryLogDisplay: React.FC<VictoryLogDisplayProps> = ({
  log,
}) => {
  if (!log.team) {
    return <div className={styles.victoryLabel}>DRAW GAME</div>;
  }

  const team = log.team;

  return (
    <Stack direction="vertical" alignment="middle" gap={10}>
      <div className={styles.victoryLabel}>Victory</div>
      <div className={styles.teamTitle}>{log.team?.name}</div>
      <Stack gap={20}>
        {log.team?.entrants.map((e) => (
          <div className={styles.icon} key={e.status.id}>
            <CombatantIcon
              combatant={e.combatant}
              teamColor={team.color}
              horizontalFlip={team.flip}
            />
          </div>
        ))}
      </Stack>
    </Stack>
  );
};
