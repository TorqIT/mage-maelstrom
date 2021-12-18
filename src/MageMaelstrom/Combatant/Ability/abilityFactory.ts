import { PassiveType, SpellType } from "./ability";
import { Passive } from "./passive";
import { Critical } from "./Passives/critical";
import { Talented } from "./Passives/talented";
import { Spell } from "./spell";
import { Fireball } from "./Spells/fireball";
import { Poison } from "./Spells/poison";

export function buildSpell(type: SpellType): Spell {
  switch (type) {
    case "fireball":
      return new Fireball();
    case "poison":
      return new Poison();
  }
}

export function buildPassive(type: PassiveType): Passive {
  switch (type) {
    case "talented":
      return new Talented();
    case "critical":
      return new Critical();
  }
}
