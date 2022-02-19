import { mmIce, mmSlow } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { Spell } from "../spell";
import { StatusEffect } from "../statusEffect";

const SLOW_MULT = 0.6;
const DAMAGE = 15;
const DURATION = 400;

export class IceBlast extends Spell {
  public constructor() {
    super({
      type: "ice",
      cooldown: 700,
      manaCost: 6,
      range: 6,
      targetTypes: "entrant",
      desc: {
        name: "Ice Blast",
        category: "debuffs",
        description: `Deal ${DAMAGE} damage and reduce the target's turn speed by ${(
          (1 - SLOW_MULT) *
          100
        ).toFixed(0)}% for ${DURATION / 100} seconds`,
        icon: mmIce,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: Entrant,
    gameManager: GameManager
  ): void {
    caster.dealMagicDamage(target, DAMAGE, "ice", mmIce);
    target.applyStatusEffect(new SlowStatus(), caster);
  }
}

class SlowStatus extends StatusEffect {
  public constructor() {
    super({
      type: "ice",
      duration: DURATION,
      isPositive: false,
      desc: {
        name: "Slow",
        description: `Reduced turn frequency by ${(
          (1 - SLOW_MULT) *
          100
        ).toFixed(0)}%`,
        icon: mmIce,
      },
    });
  }

  public override getTurnSpeedMultiplier() {
    return SLOW_MULT;
  }
}
