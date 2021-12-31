import { ActionResult } from "./actionResult";
import { Action, Entrant, ReadonlyEntrantStatus } from "../Combatant";
import { ReadonlyCoordinate } from "../Arena";

export interface Helpers {
  getActionResult: <ActionType extends Action>(
    action: ActionType
  ) => ActionResult<ActionType>;
  canPerform: (action: Action) => boolean;
  getClosest: (
    entrants: ReadonlyEntrantStatus[]
  ) => ReadonlyEntrantStatus | undefined;
  safeWhile: (
    condition: () => boolean,
    loop: () => Action | undefined | void
  ) => Action | undefined;
  coords: {
    isWithinRange: (target: ReadonlyCoordinate, range: number) => boolean;
  };
}

export function buildHelpers(
  you: ReadonlyEntrantStatus,
  getActionResult: <ActionType extends Action>(
    action: ActionType
  ) => ActionResult<ActionType>
): Helpers {
  return {
    getActionResult,
    canPerform: (a: Action) => getActionResult(a) === "Success",
    getClosest: (entrants: ReadonlyEntrantStatus[]) =>
      entrants.length > 0
        ? entrants.reduce((closest, current) =>
            getClosest(you, closest, current)
          )
        : undefined,
    safeWhile: (
      condition: () => boolean,
      loop: () => Action | undefined | void
    ) => {
      for (let j = 0; j < 100 && condition(); j++) {
        const result = loop();

        if (result) {
          return result;
        }
      }
    },
    coords: {
      isWithinRange: (target: ReadonlyCoordinate, range: number) => {
        return (
          Math.pow(you.coords.x - target.x, 2) +
            Math.pow(you.coords.y - target.y, 2) <=
          Math.pow(range, 2)
        );
      },
    },
  };
}

function getClosest(
  you: ReadonlyEntrantStatus,
  first: ReadonlyEntrantStatus,
  second: ReadonlyEntrantStatus
) {
  const firstDist =
    Math.pow(you.coords.x - first.coords.x, 2) +
    Math.pow(you.coords.y - first.coords.y, 2);
  const secondDist =
    Math.pow(you.coords.x - second.coords.x, 2) +
    Math.pow(you.coords.y - second.coords.y, 2);

  return firstDist > secondDist ? second : first;
}
