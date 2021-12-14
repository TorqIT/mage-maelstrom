import React, { useMemo } from "react";
import { CombatantIcon } from "../..";
import { Stack } from "../../../Common";
import { useGameManager } from "../../../Logic";
import { VictoryLog } from "../../../Logging/logs";
import styles from "./LogDisplay.module.css";

export interface VictoryLogDisplayProps {
  log: VictoryLog;
}

export const VictoryLogDisplay: React.FC<VictoryLogDisplayProps> = ({
  log,
}) => {
  const { teams } = useGameManager();

  const team = useMemo(
    () => teams.find((t) => t.id === log.teamId),
    [log.teamId, teams]
  );

  if (!team) {
    return <div className={styles.victoryLabel}>DRAW GAME</div>;
  }

  return (
    <Stack direction="vertical" alignment="middle" gap={10}>
      <div className={styles.victoryLabel}>Victory</div>
      <div className={styles.teamTitle}>{team.name}</div>
      <Stack gap={20}>
        {team.entrants.map((e) => (
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
