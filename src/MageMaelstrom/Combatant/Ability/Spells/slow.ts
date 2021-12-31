import { mmSlow } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { Spell } from "../spell";
import { StatusEffect } from "../statusEffect";

const SLOW_MULT = 0.7;
const DURATION = 400;

export class Slow extends Spell {
  public constructor() {
    super({
      type: "slow",
      cooldown: 800,
      manaCost: 6,
      range: 6,
      targetTypes: "entrant",
      desc: {
        name: "Slow",
        description: `Reduces the target's turn frequency by ${(
          (1 - SLOW_MULT) *
          100
        ).toFixed(0)}% for ${DURATION / 100} seconds`,
        icon: mmSlow,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: Entrant,
    gameManager: GameManager
  ): void {
    target.applyStatusEffect(new SlowStatus());

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      target: target.getCombatantInfo(),
      spellIcon: mmSlow,
    });
  }
}

class SlowStatus extends StatusEffect {
  public constructor() {
    super({
      type: "slow",
      duration: DURATION,
      isPositive: false,
      desc: {
        name: "Slow",
        description: `Reduced turn frequency by ${(
          (1 - SLOW_MULT) *
          100
        ).toFixed(0)}%`,
        icon: mmSlow,
      },
    });
  }

  public override getTurnSpeedMultiplier() {
    return SLOW_MULT;
  }
}
