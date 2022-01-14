import React, { useMemo } from "react";
import { CombatantIcon } from "../..";
import { Stack } from "../../../Common";
import { useGameManager } from "../../../Logic";
import { VictoryLog } from "../../../Logging/logs";
import styles from "./LogDisplay.module.css";
import classNames from "classnames";

export interface VictoryLogDisplayProps {
  log: VictoryLog;
}

export const VictoryLogDisplay = React.memo<VictoryLogDisplayProps>(
  ({ log }) => {
    const { teams } = useGameManager();

    const team = useMemo(
      () => teams.find((t) => t.id === log.teamId),
      [log.teamId, teams]
    );

    if (!team) {
      return (
        <div className={classNames(styles.victoryLabel, styles.drawGame)}>
          DRAW
        </div>
      );
    }

    return (
      <Stack direction="vertical" alignment="middle" gap={10}>
        <div className={styles.victoryLabel}>Victory</div>
        <div className={styles.teamTitle}>{team.name}</div>
        <Stack gap={20}>
          {team.entrants
            .filter((e) => e.essential)
            .map((e) => (
              <CombatantIcon
                key={e.status.id}
                name={e.combatant.name}
                icon={e.combatant.icon}
                color={e.color}
                horizontalFlip={team.flip}
                size={94}
              />
            ))}
        </Stack>
      </Stack>
    );
  }
);
