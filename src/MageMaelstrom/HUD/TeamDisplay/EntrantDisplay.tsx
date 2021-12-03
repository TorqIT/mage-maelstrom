import React from "react";
import { CombatantIcon, Entrant } from "../../Combatant";
import { Stack } from "../../Common";
import { HealthBar } from "../HealthBar";
import styles from "./EntrantDisplay.module.css";

export interface EntrantDisplayProps {
  entrant: Entrant<any>;
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
      <Stack reverse={flip} fill>
        <div className={styles.iconWrapper}>
          <CombatantIcon
            combatant={entrant.combatant}
            teamColor={color}
            horizontalFlip={flip}
          />
        </div>
      </Stack>
      <div style={{ marginTop: 10 }}>
        <HealthBar
          health={entrant.status.health.value}
          max={entrant.status.health.max}
        />
      </div>
    </div>
  );
};
