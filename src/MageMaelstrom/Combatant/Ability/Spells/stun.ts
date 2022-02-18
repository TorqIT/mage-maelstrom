import { mmStun } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { Spell } from "../spell";
import { StatusEffect } from "../statusEffect";

const DURATION = 100;
const PER_STRENGTH_BONUS = 3;

export class Stun extends Spell {
  public constructor() {
    super({
      type: "stun",
      cooldown: 800,
      manaCost: 15,
      range: 2,
      targetTypes: "entrant",
      desc: {
        name: "Stun",
        category: "debuffs",
        description: `Stuns the target for at least ${
          DURATION / 100
        } seconds. The higher your strength, the longer the stun.`,
        notes: [
          `Stun duration is calculated as ${DURATION / 100} + ${
            PER_STRENGTH_BONUS / 100
          } * STR seconds`,
        ],
        icon: mmStun,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: Entrant,
    gameManager: GameManager
  ): void {
    target.applyStatusEffect(
      new StunStatus(caster.getCombatant().getStrength()),
      caster
    );

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      target: target.getCombatantInfo(),
      spellIcon: mmStun,
    });
  }
}

class StunStatus extends StatusEffect {
  public constructor(strength: number) {
    super({
      type: "slow",
      duration: DURATION + PER_STRENGTH_BONUS * strength,
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
