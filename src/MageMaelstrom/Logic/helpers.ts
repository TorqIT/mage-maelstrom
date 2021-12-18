import { ActionResult } from "./actionResult";
import { Action } from "../Combatant";

export interface Helpers {
  getActionResult: (action: Action) => ActionResult;
  canPerform: (action: Action) => boolean;
}

export function buildHelpers(
  getActionResult: (action: Action) => ActionResult
): Helpers {
  return {
    getActionResult,
    canPerform: (a: Action) => getActionResult(a) === "Success",
  };
}
