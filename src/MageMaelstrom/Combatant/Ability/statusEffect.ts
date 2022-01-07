import { nextId } from "../../Common";
import { DescriptiveIcon } from "../describable";
import { DamageType, Entrant } from "../entrant";

export const statusEffectTypes = [
  "poison",
  "regen",
  "slow",
  "stun",
  "fire",
  "channeling",
  "potion",
  "barrier",
  "flash",
  "frost",
  "temporality",
  "haste",
] as const;
export type StatusEffectType = typeof statusEffectTypes[number];

export interface StatusEffectDefinition {
  desc?: DescriptiveIcon;
  type: StatusEffectType;
  duration: number;
  isPositive: boolean;
  undispellable?: boolean;
}

export interface StatusEffectStatus extends StatusEffectDefinition {
  id: number;
  ticksLeft: number;
}

export class StatusEffect {
  private def: StatusEffectDefinition;
  private id: number;

  protected timer: number;

  public constructor(def: StatusEffectDefinition) {
    this.def = def;
    this.timer = def.duration;
    this.id = nextId();
  }

  public getType() {
    return this.def.type;
  }

  public isFinished() {
    return this.timer <= 0;
  }

  public isUndispellable() {
    return this.def.undispellable;
  }

  public isPositive() {
    return this.def.isPositive;
  }

  public update(entrant: Entrant) {
    this.timer--;

    if (this.timer > 0) {
      this.updateEffect(entrant);
    }
  }

  public updateEffect(entrant: Entrant) {}

  public getHealthRegenBonus() {
    return 0;
  }

  public getHealthRegenMultiplier() {
    return 1;
  }

  public getTurnSpeedMultiplier() {
    return 1;
  }

  public getDamageTakenMultiplier(damageType: DamageType) {
    return 1;
  }

  public getVisionAdjustment() {
    return 0;
  }

  public toReadonly(): StatusEffectStatus {
    return {
      ...this.def,
      id: this.id,
      ticksLeft: this.timer,
    };
  }
}
