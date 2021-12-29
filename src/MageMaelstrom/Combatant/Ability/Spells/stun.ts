import { mmStun } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { Spell } from "../spell";
import { StatusEffect } from "../statusEffect";

const DURATION = 200;

export class Stun extends Spell {
  public constructor() {
    super({
      type: "stun",
      cooldown: 800,
      manaCost: 10,
      range: 2,
      targetTypes: "entrant",
      desc: {
        name: "Stun",
        description: `Stuns the target for ${DURATION / 100} seconds`,
        icon: mmStun,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: Entrant,
    gameManager: GameManager
  ): void {
    target.applyStatusEffect(new StunStatus());

    loggingManager.logSpell({
      attacker: caster.getCombatantInfo(),
      target: target.getCombatantInfo(),
      spellIcon: mmStun,
    });
  }
}

class StunStatus extends StatusEffect {
  public constructor() {
    super({
      type: "slow",
      duration: DURATION,
      isPositive: false,
      desc: {
        name: "Slow",
        description: "Cannot perform any action",
        icon: mmStun,
      },
    });
  }

  public override getTurnSpeedMultiplier() {
    return 0;
  }
}
