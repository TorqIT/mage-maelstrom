import { PassiveType, SpellType } from "./ability";
import { Passive } from "./passive";
import { Critical } from "./Passives/critical";
import { Talented } from "./Passives/talented";
import { Spell } from "./spell";
import { Fireball } from "./Spells/fireball";
import { Force } from "./Spells/force";
import { Heal } from "./Spells/heal";
import { Poison } from "./Spells/poison";
import { Regen } from "./Spells/regen";
import { SummonBear } from "./Spells/summonBear";

export function buildSpell(type: SpellType): Spell {
  switch (type) {
    case "fireball":
      return new Fireball();
    case "poison":
      return new Poison();
    case "bear":
      return new SummonBear();
    case "heal":
      return new Heal();
    case "regen":
      return new Regen();
    case "force":
      return new Force();
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
