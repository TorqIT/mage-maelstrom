import {
  Action,
  AttackAction,
  MovementAction,
  SpellAction,
} from "../Combatant";

export type MoveResult = "Success" | "OutOfArena" | "TileOccupied";

export type AttackResult =
  | "Success"
  | "OutOfRange"
  | "CombatantNotFound"
  | "TargetIsDead";

export type SpellResult =
  | "Success"
  | "OutOfRange"
  | "CombatantNotFound"
  | "TargetIsDead"
  | "InvalidSpell"
  | "WrongTargetType"
  | "NotEnoughMana"
  | "OnCooldown";

export type ActionResult<ActionType extends Action> =
  ActionType extends MovementAction
    ? MoveResult
    : ActionType extends AttackAction
    ? AttackResult
    : ActionType extends SpellAction
    ? SpellResult
    : "UknownAction";
