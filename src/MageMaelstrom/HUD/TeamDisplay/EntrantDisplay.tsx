import React from "react";
import { CombatantIcon, Entrant } from "../../Combatant";
import { Stack } from "../../Common";
import styles from "./EntrantDisplay.module.css";

export interface EntrantDisplayProps {
  entrant: Entrant;
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
        <div>hello</div>
      </Stack>
    </div>
  );
};
