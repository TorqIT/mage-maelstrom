import React from "react";
import { Stack } from "../Common";
import { Tile } from "./Tile";
import styles from "./Arena.module.css";
import { Entrant } from "../Combatant";

export interface ArenaProps {
  width: number;
  height: number;
  entrants: Entrant[];
}

export const Arena: React.FC<ArenaProps> = ({ width, height, entrants }) => {
  const columns = Array.from(Array(width).keys());
  const rows = Array.from(Array(height).keys());

  return (
    <Stack alignment="middle">
      <Stack direction="vertical" className={styles.arena}>
        {rows.map((y) => (
          <Stack key={y}>
            {columns.map((x) => (
              <Tile
                key={x}
                combatant={
                  entrants.find(
                    (e) => e.status.coord.x === x && e.status.coord.y === y
                  )?.combatant
                }
              />
            ))}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
