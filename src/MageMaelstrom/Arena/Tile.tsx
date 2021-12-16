import classNames from "classnames";
import React from "react";
import { CombatantDefinition } from "../Combatant";
import { CombatantIcon } from "../HUD";
import styles from "./Tile.module.css";

export interface TileProps {
  combatant?: CombatantDefinition;
  teamColor?: string;
  flip?: boolean;
  teamsWithVision?: number;
}

export const Tile: React.FC<TileProps> = ({
  combatant,
  teamColor,
  flip,
  teamsWithVision,
}) => {
  return (
    <div
      className={classNames(styles.tile, {
        [styles.oneSeesIt]: teamsWithVision === 1,
        [styles.bothSeeIt]: teamsWithVision === 2,
      })}
    >
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
