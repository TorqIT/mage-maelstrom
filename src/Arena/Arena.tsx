import React from "react";
import { Stack } from "../Common";
import { Tile } from "./Tile";
import styles from "./Arena.module.css";

export interface ArenaProps {
  width: number;
  height: number;
}

export const Arena: React.FC<ArenaProps> = ({ width, height }) => {
  const columns = Array.from(Array(width).keys());
  const rows = Array.from(Array(height).keys());

  return (
    <Stack alignment="middle">
      <Stack direction="vertical" className={styles.arena}>
        {rows.map((y) => (
          <Stack key={y}>
            {columns.map((x) => (
              <Tile key={x} />
            ))}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
