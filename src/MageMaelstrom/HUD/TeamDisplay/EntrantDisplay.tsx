import React from "react";
import { CombatantIcon, ReadonlyEntrant } from "../../Combatant";
import { Stack } from "../../Common";
import { HealthBar } from "../HealthBar";
import styles from "./EntrantDisplay.module.css";

export interface EntrantDisplayProps {
  entrant: ReadonlyEntrant;
  color: string;
  flip?: boolean;
}

export const EntrantDisplay: React.FC<EntrantDisplayProps> = ({
  entrant,
  color,
  flip,
}) => {
  return (
    <div className={styles.wrapper}>
      <Stack reverse={flip} fill gap={5}>
        <div className={styles.iconWrapper}>
          <CombatantIcon
            combatant={entrant.combatant}
            teamColor={color}
            horizontalFlip={flip}
          />
        </div>
        <div className={styles.name}>{entrant.combatant.name}</div>
      </Stack>
      <div style={{ marginTop: 10 }}>
        <HealthBar
          health={entrant.status.health.value}
          max={entrant.status.health.max}
        />
        <div style={{ marginTop: 5 }}>
          <HealthBar
            health={entrant.status.mana.value}
            max={entrant.status.mana.max}
            color={"rgb(100, 79, 255)"}
          />
        </div>
      </div>
    </div>
  );
};
