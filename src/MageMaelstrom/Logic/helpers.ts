import { ActionResult } from "./actionResult";
import { Action } from "../Combatant";
import { ReadonlyCoordinate } from "../Arena";

export interface Helpers {
  getActionResult: <ActionType extends Action>(
    action: ActionType
  ) => ActionResult<ActionType>;
  canPerform: (action: Action) => boolean;
  coords: {
    isWithinRange: (
      first: ReadonlyCoordinate,
      second: ReadonlyCoordinate,
      range: number
    ) => boolean;
  };
}

export function buildHelpers(
  getActionResult: <ActionType extends Action>(
    action: ActionType
  ) => ActionResult<ActionType>
): Helpers {
  return {
    getActionResult,
    canPerform: (a: Action) => getActionResult(a) === "Success",
    coords: {
      isWithinRange: (
        first: ReadonlyCoordinate,
        second: ReadonlyCoordinate,
        range: number
      ) => {
        return (
          Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2) <=
          Math.pow(range, 2)
        );
      },
    },
  };
}
