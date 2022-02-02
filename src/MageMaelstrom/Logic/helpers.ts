import { ActionResult } from "./actionResult";
import { Action, Entrant, ReadonlyEntrantStatus } from "../Combatant";
import { BasicCoordinate } from "../Arena";

export interface Helpers {
  getActionResult: <ActionType extends Action>(
    action: ActionType
  ) => ActionResult<ActionType>;
  canPerform: (action: Action) => boolean;
  getClosest: (
    entrants: ReadonlyEntrantStatus[]
  ) => ReadonlyEntrantStatus | undefined;
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
  };
}

function getClosest(
  you: ReadonlyEntrantStatus,
  first: ReadonlyEntrantStatus,
  second: ReadonlyEntrantStatus
) {
  const firstDist =
    Math.pow(you.coords.getX() - first.coords.getX(), 2) +
    Math.pow(you.coords.getY() - first.coords.getY(), 2);
  const secondDist =
    Math.pow(you.coords.getX() - second.coords.getX(), 2) +
    Math.pow(you.coords.getY() - second.coords.getY(), 2);

  return firstDist > secondDist ? second : first;
}
