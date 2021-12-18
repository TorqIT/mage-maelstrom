export type ActionResult =
  | "Success"
  | "OutOfArena"
  | "TileOccupied"
  | "UnknownAction"
  | "OutOfRange"
  | "CombatantNotFound"
  | "TargetIsDead"
  | "InvalidSpell"
  | "InvalidTarget"
  | "NotEnoughMana"
  | "OnCooldown";
