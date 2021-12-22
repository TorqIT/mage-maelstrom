import { nextId } from "../../Common";
import { DescriptiveIcon } from "../describable";

const spellTypes = ["fireball", "poison", "bear"] as const;
const passiveTypes = ["talented", "critical"] as const;

export type SpellType = typeof spellTypes[number];
export type PassiveType = typeof passiveTypes[number];

export type AbilityType = SpellType | PassiveType;

export function isSpell(type: AbilityType): type is SpellType {
  return spellTypes.includes(type as SpellType);
}

export function isPassive(type: AbilityType): type is PassiveType {
  return passiveTypes.includes(type as PassiveType);
}

export interface AbilityDefinition {
  desc?: DescriptiveIcon;
  type: AbilityType;
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
