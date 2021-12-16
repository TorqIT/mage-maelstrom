import classNames from "classnames";
import React from "react";
import { CombatantDefinition } from "../Combatant";
import { CombatantIcon } from "../HUD";
import styles from "./Tile.module.css";

export interface TileProps {
  combatant?: CombatantDefinition;
  teamColor?: string;
  flip?: boolean;
  isInVision?: boolean;
}

export const Tile: React.FC<TileProps> = ({
  combatant,
  teamColor,
  flip,
  isInVision,
}) => {
  return (
    <div className={classNames(styles.tile, { [styles.inVision]: isInVision })}>
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
