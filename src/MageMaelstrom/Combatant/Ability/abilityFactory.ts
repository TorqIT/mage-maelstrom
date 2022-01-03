import { PassiveType, SpellType } from "./ability";
import { Passive } from "./passive";
import { Critical } from "./Passives/critical";
import { DoubleTap } from "./Passives/doubleTap";
import { Evasion } from "./Passives/evasion";
import { ManaSteal } from "./Passives/manaSteal";
import { Talented } from "./Passives/talented";
import { Teleportitis } from "./Passives/teleportitis";
import { Thorns } from "./Passives/thorns";
import { Vision } from "./Passives/vision";
import { Spell } from "./spell";
import { Barrier } from "./Spells/barrier";
import { Dash } from "./Spells/dash";
import { Dispel } from "./Spells/dispel";
import { Fireball } from "./Spells/fireball";
import { Flash } from "./Spells/flash";
import { Force } from "./Spells/force";
import { Heal } from "./Spells/heal";
import { HealthPotion } from "./Spells/healthPotion";
import { Meteor } from "./Spells/meteor";
import { Poison } from "./Spells/poison";
import { Regen } from "./Spells/regen";
import { Slow } from "./Spells/slow";
import { Snipe } from "./Spells/snipe";
import { Stun } from "./Spells/stun";
import { SummonBear } from "./Spells/summonBear";
import { Swift } from "./Spells/swift";

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
    case "potion":
      return new HealthPotion();
    case "barrier":
      return new Barrier();
    case "flash":
      return new Flash();
    case "swift":
      return new Swift();
    case "dispel":
      return new Dispel();
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
    case "teleportitis":
      return new Teleportitis();
    case "doubletap":
      return new DoubleTap();
    case "evasion":
      return new Evasion();
  }
}
