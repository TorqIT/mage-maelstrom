import classNames from "classnames";
import React from "react";
import { CombatantIcon } from "../HUD";
import { CombatantInfo } from "../Logic";
import styles from "./Tile.module.css";

export interface TileProps {
  combatant?: CombatantInfo;
  flip?: boolean;
  teamsWithVision?: number;
}

export const Tile = React.memo<TileProps>(
  ({ combatant, flip, teamsWithVision }) => {
    return (
      <div
        className={classNames(styles.tile, {
          [styles.oneSeesIt]: teamsWithVision === 1,
          [styles.bothSeeIt]: teamsWithVision === 2,
        })}
      >
        {combatant && (
          <CombatantIcon {...combatant} horizontalFlip={flip} size={40} />
        )}
      </div>
    );
  }
);
