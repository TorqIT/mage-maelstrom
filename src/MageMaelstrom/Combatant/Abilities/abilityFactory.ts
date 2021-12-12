import { AbilityType } from "./ability";
import { Fireball } from "./fireball";

const passives: AbilityType[] = [];

export function isSpell(type: AbilityType) {
  return !passives.includes(type);
}

export function buildSpell(type: AbilityType) {
  switch (type) {
    case AbilityType.Fireball:
      return new Fireball();
  }

  throw new Error("Given type is not a spell");
}
