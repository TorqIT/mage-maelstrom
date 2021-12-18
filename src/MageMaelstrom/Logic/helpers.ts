import { ActionResult } from "./actionResult";
import { Action } from "../Combatant";

export interface Helpers {
  getActionResult: <ActionType extends Action>(
    action: ActionType
  ) => ActionResult<ActionType>;
  canPerform: (action: Action) => boolean;
}

export function buildHelpers(
  getActionResult: <ActionType extends Action>(
    action: ActionType
  ) => ActionResult<ActionType>
): Helpers {
  return {
    getActionResult,
    canPerform: (a: Action) => getActionResult(a) === "Success",
  };
}
