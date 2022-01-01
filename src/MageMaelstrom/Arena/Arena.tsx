import React, { useMemo } from "react";
import { Stack } from "../Common";
import { Tile } from "./Tile";
import styles from "./Arena.module.css";
import { ActiveTeam, ReadonlyActiveTeam, ReadonlyEntrant } from "../Combatant";
import { useGameManager } from "../Logic";
import { useGameSpecs } from "../Logic/GameSpecsProvider";
import { ReadonlyCoordinate } from ".";

function findOccupant(
  perspectiveTeams: ReadonlyActiveTeam[],
  enemyTeam: ReadonlyActiveTeam | undefined,
  x: number,
  y: number
) {
  for (const team of perspectiveTeams) {
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

  if (enemyTeam) {
    for (const enemy of enemyTeam.entrants) {
      if (
        enemy.status.coords.x === x &&
        enemy.status.coords.y === y &&
        enemy.status.health.value > 0 &&
        perspectiveTeams.some((t) =>
          t.entrants.some((e) =>
            isInVisionOf(e, enemy.status.coords.x, enemy.status.coords.y)
          )
        )
      ) {
        return { entrant: enemy, team: enemyTeam };
      }
    }
  }
}

function getNumberOfTeamsWhoHaveVision(
  x: number,
  y: number,
  teams: ReadonlyActiveTeam[]
) {
  return teams.filter((t) =>
    t.entrants.some((e) => e.status.health.value > 0 && isInVisionOf(e, x, y))
  ).length;
}

function isInVisionOf(looker: ReadonlyEntrant, x: number, y: number) {
  return (
    Math.pow(looker.status.coords.x - x, 2) +
      Math.pow(looker.status.coords.y - y, 2) <=
    Math.pow(looker.status.vision, 2)
  );
}

export interface ArenaProps {
  leftVision?: boolean;
  rightVision?: boolean;
}

export const Arena: React.FC<ArenaProps> = ({
  leftVision = true,
  rightVision = true,
}) => {
  const { arena } = useGameSpecs();
  const { leftTeam, rightTeam } = useGameManager();

  const columns = Array.from(Array(arena.width).keys());
  const rows = Array.from(Array(arena.height).keys());

  if (!leftTeam || !rightTeam) {
    return null;
  }

  const perspectiveTeams: ReadonlyActiveTeam[] = [];
  let enemyTeam: ReadonlyActiveTeam | undefined;

  if (leftVision) {
    perspectiveTeams.push(leftTeam);
  } else {
    enemyTeam = leftTeam;
  }

  if (rightVision) {
    perspectiveTeams.push(rightTeam);
  } else {
    enemyTeam = rightTeam;
  }

  return (
    <Stack alignment="middle">
      <Stack direction="vertical" reverse className={styles.arena}>
        {rows.map((y) => (
          <Stack key={y}>
            {columns.map((x) => {
              const occupant = findOccupant(perspectiveTeams, enemyTeam, x, y);

              return (
                <Tile
                  key={x}
                  combatant={
                    occupant
                      ? {
                          name: occupant.entrant.combatant.name,
                          icon: occupant.entrant.combatant.icon,
                          color: occupant.entrant.color,
                        }
                      : undefined
                  }
                  flip={occupant?.team.flip}
                  teamsWithVision={getNumberOfTeamsWhoHaveVision(
                    x,
                    y,
                    perspectiveTeams
                  )}
                />
              );
            })}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
