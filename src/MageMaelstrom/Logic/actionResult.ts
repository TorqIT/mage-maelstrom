export enum ActionResult {
  Success = "Success",
  OutOfArena = "OutOfArena",
  TileOccupied = "TileOccupied",
  UnknownAction = "UnknownAction",

  OutOfRange = "OutOfRange",
  CombatantNotFound = "CombatantNotFound",
  TargetIsDead = "TargetIsDead",

  InvalidSpell = "InvalidSpell",
  InvalidTarget = "InvalidTarget",
  NotEnoughMana = "NotEnoughMana",
  OnCooldown = "OnCooldown",
}
