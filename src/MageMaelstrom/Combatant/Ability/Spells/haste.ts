import { Spell, StatusEffect } from "..";
import { mmHaste } from "../../../Common/Icon";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";

const HIGH_SPEED_MULT = 2.2;
const LOW_SPEED_MULT = 0.4;
const DURATION = 700;

export class Haste extends Spell {
  public constructor() {
    super({
      type: "haste",
      cooldown: 400,
      manaCost: 20,
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
        flavorText:
          "Don't worry about the slowdown, just keep recasting it! Hope you've got enough mana!",
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
      type: "haste",
      duration: DURATION,
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
    return (
      LOW_SPEED_MULT +
      (HIGH_SPEED_MULT - LOW_SPEED_MULT) * (this.timer / DURATION)
    );
  }
}
