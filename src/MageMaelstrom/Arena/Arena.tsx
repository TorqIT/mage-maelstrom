import React from "react";
import { Stack } from "../Common";
import { Tile } from "./Tile";
import styles from "./Arena.module.css";
import { ActiveTeam } from "../Combatant";
import { useGameManager } from "../Logic/GameManagerProvider";

export interface ArenaProps {}

export const Arena: React.FC<ArenaProps> = ({}) => {
  const { leftTeam, rightTeam, specs } = useGameManager();

  const columns = Array.from(Array(specs.arena.width).keys());
  const rows = Array.from(Array(specs.arena.height).keys());

  return (
    <Stack alignment="middle">
      <Stack direction="vertical" className={styles.arena}>
        {rows.map((y) => (
          <Stack key={y}>
            {columns.map((x) => {
              const occupant = findOccupant(
                leftTeam && rightTeam ? [leftTeam, rightTeam] : [],
                x,
                y
              );

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
      if (entrant.status.coords.x === x && entrant.status.coords.y === y) {
        return { combatant: entrant.combatant, team: team };
      }
    }
  }
}
