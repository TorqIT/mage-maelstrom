import React from "react";
import { Combatant, CombatantIcon } from "../Combatant";
import styles from "./Tile.module.css";

export interface TileProps {
  combatant?: Combatant<any>;
  teamColor?: string;
  flip?: boolean;
}

export const Tile: React.FC<TileProps> = ({ combatant, teamColor, flip }) => {
  return (
    <div className={styles.tile}>
      {combatant && teamColor && (
        <CombatantIcon
          combatant={combatant}
          teamColor={teamColor}
          horizontalFlip={flip}
        />
      )}
    </div>
  );
};
