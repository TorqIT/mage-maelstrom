import { Action, ActParams } from "..";
import { nextId } from "../../Common";
import { GameManager } from "../../Logic/GameManager";
import { DescriptiveIcon } from "../describable";
import { DamageType, Entrant } from "../entrant";

export const statusEffectTypes = [
  "poison",
  "regen",
  "ice",
  "stun",
  "fire",
  "channeling",
  "potion",
  "barrier",
  "flash",
  "frost",
  "temporality",
  "burnout",
  "bleed",
  "darkness",
  "fear",
  "charged",
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

  private finishNow = false;

  protected timer: number;

  public constructor(def: StatusEffectDefinition) {
    this.def = def;
    this.timer = def.duration;
    this.id = nextId();
  }

  public getType() {
    return this.def.type;
  }

  protected forceFinish() {
    this.finishNow = true;
  }

  public isFinished() {
    return this.timer <= 0 || this.finishNow;
  }

  public isUndispellable() {
    return this.def.undispellable;
  }

  public isPositive() {
    return this.def.isPositive;
  }

  public update(entrant: Entrant, gameManager: GameManager) {
    this.timer--;

    if (this.timer > 0) {
      this.updateEffect(entrant, gameManager);
    }
  }

  public updateEffect(entrant: Entrant, gameManager: GameManager) {}

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

  public getAttackDamageMultiplier() {
    return 1;
  }

  public getVisionAdjustment() {
    return 0;
  }

  public getOverrideAction(params: ActParams): Action | undefined {
    return undefined;
  }

  public toReadonly(): StatusEffectStatus {
    return {
      ...this.def,
      id: this.id,
      ticksLeft: this.timer,
    };
  }
}
