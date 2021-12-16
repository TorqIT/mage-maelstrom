import React, { useMemo } from "react";
import { Stack } from "../Common";
import { Tile } from "./Tile";
import styles from "./Arena.module.css";
import { ActiveTeam, ReadonlyActiveTeam, ReadonlyEntrant } from "../Combatant";
import { useGameManager } from "../Logic/GameManagerProvider";

function findOccupant(teams: ReadonlyActiveTeam[], x: number, y: number) {
  for (const team of teams) {
    for (const entrant of team.entrants) {
      if (
        entrant.status.coords.x === x &&
        entrant.status.coords.y === y &&
        entrant.status.health.value > 0
      ) {
        return { entrant, team };
      }
    }
  }
}

function isInVision(x: number, y: number, entrants: ReadonlyEntrant[]) {
  return entrants.some(
    (e) =>
      e.status.health.value > 0 &&
      Math.pow(e.status.coords.x - x, 2) + Math.pow(e.status.coords.y - y, 2) <=
        Math.pow(e.status.vision, 2)
  );
}

export interface ArenaProps {}

export const Arena: React.FC<ArenaProps> = ({}) => {
  const { leftTeam, rightTeam, specs } = useGameManager();

  const teams = useMemo(
    () => (leftTeam && rightTeam ? [leftTeam, rightTeam] : []),
    [leftTeam, rightTeam]
  );
  const entrants = useMemo(
    () =>
      leftTeam && rightTeam ? leftTeam.entrants.concat(rightTeam.entrants) : [],
    [leftTeam, rightTeam]
  );

  const columns = Array.from(Array(specs.arena.width).keys());
  const rows = Array.from(Array(specs.arena.height).keys());

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
                  combatant={occupant?.entrant.combatant}
                  teamColor={occupant?.team.color}
                  flip={occupant?.team.flip}
                  isInVision={isInVision(x, y, entrants)}
                />
              );
            })}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
