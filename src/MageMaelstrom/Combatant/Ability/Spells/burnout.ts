import { Spell, StatusEffect } from "..";
import { mmHaste } from "../../../Common/Icon";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";

const HIGH_SPEED_MULT = 2.0;
const LOW_SPEED_MULT = 0.5;
const DURATION = 700;
const FINAL_SLOW_DURATION = 200;

export class Burnout extends Spell {
  public constructor() {
    super({
      type: "burnout",
      cooldown: 400,
      manaCost: 25,
      targetTypes: ["entrant", "nothing"],
      range: 5,
      desc: {
        name: "Burnout",
        category: "mobility",
        description:
          `Boosts the target's turn speed up to ${HIGH_SPEED_MULT}x, then slows ` +
          `them down to ${LOW_SPEED_MULT}x speed over ${
            DURATION / 100
          } seconds`,
        notes: [
          `The ${LOW_SPEED_MULT}x speed lingers for ${
            FINAL_SLOW_DURATION / 100
          } seconds`,
        ],
        flavorText: "Just keep casting it and you'll be fine",
        icon: mmHaste,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: Entrant | undefined,
    gameManager: GameManager
  ): void {
    (target ?? caster).applyStatusEffect(new HasteStatus(), caster);
  }
}

class HasteStatus extends StatusEffect {
  public constructor() {
    super({
      type: "burnout",
      duration: DURATION + FINAL_SLOW_DURATION,
      isPositive: true,
      desc: {
        name: "Burnout",
        description:
          `Boosts turn speed up to ${HIGH_SPEED_MULT}x, then slow ` +
          `down to ${LOW_SPEED_MULT}x speed over ${DURATION / 100} seconds`,
        icon: mmHaste,
      },
    });
  }

  public override getTurnSpeedMultiplier(): number {
    return this.timer > FINAL_SLOW_DURATION
      ? LOW_SPEED_MULT +
          (HIGH_SPEED_MULT - LOW_SPEED_MULT) * (this.timer / DURATION)
      : LOW_SPEED_MULT;
  }
}
