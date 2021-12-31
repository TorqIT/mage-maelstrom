import { PassiveType, SpellType } from "./ability";
import { Passive } from "./passive";
import { Critical } from "./Passives/critical";
import { ManaSteal } from "./Passives/manaSteal";
import { Talented } from "./Passives/talented";
import { Thorns } from "./Passives/thorns";
import { Vision } from "./Passives/vision";
import { Spell } from "./spell";
import { Dash } from "./Spells/dash";
import { Fireball } from "./Spells/fireball";
import { Force } from "./Spells/force";
import { Heal } from "./Spells/heal";
import { Meteor } from "./Spells/meteor";
import { Poison } from "./Spells/poison";
import { Regen } from "./Spells/regen";
import { Slow } from "./Spells/slow";
import { Snipe } from "./Spells/snipe";
import { Stun } from "./Spells/stun";
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
    case "slow":
      return new Slow();
    case "stun":
      return new Stun();
    case "snipe":
      return new Snipe();
    case "dash":
      return new Dash();
    case "meteor":
      return new Meteor();
  }
}

export function buildPassive(type: PassiveType): Passive {
  switch (type) {
    case "talented":
      return new Talented();
    case "critical":
      return new Critical();
    case "thorns":
      return new Thorns();
    case "vision":
      return new Vision();
    case "manasteal":
      return new ManaSteal();
  }
}
