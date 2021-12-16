import { AbilityType } from ".";
import { IconDef } from "../../Common/Icon";
import { Ability } from "./ability";

export interface PassiveStatus {
  type: AbilityType;
  icon: IconDef;
  id: number;
}

export class Passive extends Ability {
  public getMaxStatAdjustment() {
    return 0;
  }

  public toReadonly(): PassiveStatus {
    return {
      type: this.type,
      icon: this.icon,
      id: this.id,
    };
  }
}
