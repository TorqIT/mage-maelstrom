import { StatusEffect, StatusEffectType } from ".";
import { Entrant } from "..";
import { IconDef } from "../../Common/Icon";

export class ChannelingStatus extends StatusEffect {
  private onFinish: () => void;

  public constructor(
    duration: number,
    spellName: string,
    icon: IconDef,
    onFinish: () => void
  ) {
    super({
      type: "channeling",
      duration,
      isPositive: true,
      undispellable: true,
      desc: {
        name: "Channeling",
        description: "Channeling " + spellName,
        icon,
      },
    });

    this.onFinish = onFinish;
  }

  public override getTurnSpeedMultiplier() {
    return 0;
  }

  public override updateEffect(entrant: Entrant) {
    if (this.timer === 1) {
      this.onFinish();
    }
  }
}
