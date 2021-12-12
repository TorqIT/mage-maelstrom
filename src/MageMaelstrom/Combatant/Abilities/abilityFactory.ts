import { Entrant } from "../entrant";
import { AbilityType } from "./ability";
import { Fireball } from "./fireball";

const passives: AbilityType[] = [];

export function isSpell(type: AbilityType) {
  return !passives.includes(type);
}

export function buildSpell(type: AbilityType, owner: Entrant) {
  switch (type) {
    case AbilityType.Fireball:
      return new Fireball(owner);
  }

  throw new Error("Given type is not a spell");
}
