import { nextId } from "../../Common";
import { DescriptiveIcon } from "../describable";

const spellTypes = [
  "fireball",
  "poison",
  "bear",
  "heal",
  "regen",
  "force",
  "slow",
  "stun",
  "snipe",
  "dash",
  "meteor",
  "potion",
  "barrier",
  "flash",
  "swift",
  "dispel",
  "teleport",
  "haste",
  "burst",
] as const;

const passiveTypes = [
  "talented",
  "critical",
  "thorns",
  "vision",
  "manasteal",
  "teleportitis",
  "doubletap",
  "evasion",
  "frost",
] as const;

export type SpellType = typeof spellTypes[number];
export type PassiveType = typeof passiveTypes[number];

export type AbilityType = SpellType | PassiveType;

const internalPassiveTypes = ["bearPassive"] as const;

export type InternalPassiveType = typeof internalPassiveTypes[number];
export type ExtendedPassiveType = PassiveType | InternalPassiveType;

export type ExtendedAbilityType = SpellType | ExtendedPassiveType;

export function isSpell(type: AbilityType): type is SpellType {
  return spellTypes.includes(type as SpellType);
}

export function isPassive(type: ExtendedAbilityType): type is PassiveType {
  return passiveTypes.includes(type as PassiveType);
}

export interface AbilityDefinition {
  desc?: DescriptiveIcon;
  type: ExtendedAbilityType;
}

export interface AbilityStatus extends AbilityDefinition {
  id: number;
}

export abstract class Ability {
  protected def: AbilityDefinition;
  protected id: number;

  public constructor(def: AbilityDefinition) {
    this.def = def;
    this.id = nextId();
  }

  public getType() {
    return this.def.type;
  }

  public toReadonly(): AbilityStatus {
    return {
      ...this.def,
      id: this.id,
    };
  }
}
