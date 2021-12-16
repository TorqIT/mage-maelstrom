import { nextId } from "../../Common";
import { IconDef } from "../../Common/Icon";

const spellTypes = ["fireball"] as const;
const passiveTypes = ["talented"] as const;

export type SpellType = typeof spellTypes[number];
export type PassiveType = typeof passiveTypes[number];

export type AbilityType = SpellType | PassiveType;

export function isSpell(type: AbilityType): type is SpellType {
  return spellTypes.includes(type as SpellType);
}

export function isPassive(type: AbilityType): type is PassiveType {
  return passiveTypes.includes(type as PassiveType);
}

export abstract class Ability {
  protected type: AbilityType;
  protected icon: IconDef;
  protected id: number;

  public constructor(type: AbilityType, icon: IconDef) {
    this.type = type;
    this.icon = icon;
    this.id = nextId();
  }

  public getType() {
    return this.type;
  }

  public getIcon() {
    return this.icon;
  }
}
