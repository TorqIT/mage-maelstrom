import React from "react";
import { Combatant, CombatantIcon } from "../Combatant";
import styles from "./Tile.module.css";

export interface TileProps {
  combatant?: Combatant;
}

export const Tile: React.FC<TileProps> = ({ combatant }) => {
  return (
    <div className={styles.tile}>
      {combatant && <CombatantIcon combatant={combatant} />}
    </div>
  );
};
