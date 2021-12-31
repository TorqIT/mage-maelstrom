import { nextId } from "../../Common";
import { DescriptiveIcon } from "../describable";
import { Entrant } from "../entrant";

export const statusEffectTypes = [
  "poison",
  "regen",
  "slow",
  "stun",
  "fire",
  "channeling",
] as const;
export type StatusEffectType = typeof statusEffectTypes[number];

export interface StatusEffectDefinition {
  desc?: DescriptiveIcon;
  type: StatusEffectType;
  duration: number;
  isPositive: boolean;
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

  public toReadonly(): StatusEffectStatus {
    return {
      ...this.def,
      id: this.id,
      ticksLeft: this.timer,
    };
  }
}
