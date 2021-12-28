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
    : "UnknownAction";

export function getActionResultString(
  result: MoveResult | AttackResult | SpellResult | "UnknownAction"
): string {
  switch (result) {
    case "Success":
      return "Action successful!";
    case "CombatantNotFound":
      return "The combatant tried to perform an action on a non-existent target";
    case "InvalidSpell":
      return "The combatant tried to cast a spell they do not know or doesn't exist";
    case "NotEnoughMana":
      return "The combatant did not have enough mana to cast this spell";
    case "OnCooldown":
      return "The combatant tried to cast a spell that was on cooldown";
    case "OutOfArena":
      return "The combatant attempted to move out of bounds";
    case "OutOfRange":
      return "The combatant tried to cast a spell on a target that was out of the spell's range";
    case "TargetIsDead":
      return "The combatant tried to perform an action on a dead target";
    case "TileOccupied":
      return "The combatant tried to move to an occupied tile";
    case "WrongTargetType":
      return "The combatant tried to cast a spell on the wrong type of target";
    case "UnknownAction":
      return "I have no clue what action the combatant was even attempting to do";
  }
}
