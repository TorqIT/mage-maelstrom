import { Spell, StatusEffect } from "..";
import { mmBarrier } from "../../../Common/Icon";
import { invertPercentage } from "../../../Common/labels";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { DamageType, Entrant } from "../../entrant";
import { FullSpellTarget } from "../spell";

const MAGIC_MULT = 0.65;
const ATTACK_MULT = 0.75;
const DURATION = 800;

export class Barrier extends Spell {
  public constructor() {
    super({
      type: "barrier",
      cooldown: 400,
      manaCost: 10,
      range: 5,
      targetTypes: ["nothing", "entrant"],
      desc: {
        name: "Barrier",
        category: "defensive",
        description:
          `Reduce magic damage taken by ${invertPercentage(MAGIC_MULT)}% and ` +
          `attack damage taken by ${invertPercentage(ATTACK_MULT)}% for ${
            DURATION / 100
          } seconds`,
        icon: mmBarrier,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: Entrant | undefined,
    gameManager: GameManager
  ): void {
    (target ?? caster).applyStatusEffect(new BarrierStatus(), caster);

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      spellIcon: mmBarrier,
      target: target?.getCombatantInfo(),
    });
  }
}

class BarrierStatus extends StatusEffect {
  public constructor() {
    super({
      type: "barrier",
      duration: DURATION,
      isPositive: true,
      desc: {
        name: "Barrier",
        description:
          `Reduce magic damage taken by ${invertPercentage(MAGIC_MULT)}% and ` +
          `reduce attack damage taken by ${invertPercentage(ATTACK_MULT)}%`,
        icon: mmBarrier,
      },
    });
  }

  public override getDamageTakenMultiplier(damageType: DamageType): number {
    switch (damageType) {
      case "attack":
        return ATTACK_MULT;
      case "magic":
        return MAGIC_MULT;
      default:
        return 1;
    }
  }
}
