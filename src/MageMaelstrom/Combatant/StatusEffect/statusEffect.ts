import { nextId } from "../../Common";
import { Describable } from "../describable";
import { Entrant } from "../entrant";

export const statusEffectTypes = ["poison"] as const;
export type StatusEffectType = typeof statusEffectTypes[number];

export interface StatusEffectDefinition extends Describable {
  type: StatusEffectType;
  duration: number;
  isPositive: boolean;
}

export interface StatusEffectStatus extends StatusEffectDefinition {
  id: number;
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

  public toReadonly(): StatusEffectStatus {
    return {
      ...this.def,
      id: this.id,
    };
  }
}
