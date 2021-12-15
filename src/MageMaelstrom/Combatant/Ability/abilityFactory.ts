import { PassiveType, SpellType } from "./ability";
import { Talented } from "./Passives/talented";
import { Fireball } from "./Spells/fireball";

export function buildSpell(type: SpellType) {
  switch (type) {
    case "fireball":
      return new Fireball();
  }

  throw new Error("Given type is not a spell");
}

export function buildPassive(type: PassiveType) {
  switch (type) {
    case "talented":
      return new Talented();
  }

  throw new Error("Given type is not a passive");
}
