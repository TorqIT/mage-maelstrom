import React from "react";
import { Stack } from "../Common";
import { Tile } from "./Tile";
import styles from "./Arena.module.css";
import { ActiveTeam } from "../Combatant";

export interface ArenaProps {
  width: number;
  height: number;
  teams: ActiveTeam[];
}

export const Arena: React.FC<ArenaProps> = ({ width, height, teams }) => {
  const columns = Array.from(Array(width).keys());
  const rows = Array.from(Array(height).keys());

  return (
    <Stack alignment="middle">
      <Stack direction="vertical" className={styles.arena}>
        {rows.map((y) => (
          <Stack key={y}>
            {columns.map((x) => {
              const occupant = findOccupant(teams, x, y);

              return (
                <Tile
                  key={x}
                  combatant={occupant?.combatant}
                  teamColor={occupant?.team.color}
                  flip={occupant?.team.flip}
                />
              );
            })}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

function findOccupant(teams: ActiveTeam[], x: number, y: number) {
  for (const team of teams) {
    for (const entrant of team.entrants) {
      if (entrant.status.coord.x === x && entrant.status.coord.y === y) {
        return { combatant: entrant.combatant, team: team };
      }
    }
  }
}
