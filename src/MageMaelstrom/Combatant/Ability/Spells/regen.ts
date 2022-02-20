import { mmRegen } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { SpellResult } from "../../../Logic";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { FullSpellTarget, Spell } from "../spell";
import { StatusEffect } from "../statusEffect";

const REGEN_PER_SECOND = 10;
const DURATION = 800;

export class Regen extends Spell {
  public constructor() {
    super({
      type: "regen",
      cooldown: 600,
      manaCost: 14,
      range: 4,
      targetTypes: ["entrant", "nothing"],
      desc: {
        name: "Regen",
        category: "restoration",
        description: `Increases the target's regeneration by ${REGEN_PER_SECOND}/s for ${
          DURATION / 100
        } seconds`,
        icon: mmRegen,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: Entrant | undefined,
    gameManager: GameManager
  ): void {
    (target ?? caster).applyStatusEffect(new RegenStatus(), caster);

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      target: target?.getCombatantInfo(),
      spellIcon: mmRegen,
    });
  }
}

class RegenStatus extends StatusEffect {
  public constructor() {
    super({
      duration: DURATION,
      isPositive: true,
      type: "regen",
      desc: {
        icon: mmRegen,
        name: "Regen",
        description: `Health regeneration is increased by ${REGEN_PER_SECOND}/s`,
      },
    });
  }

  public override getHealthRegenBonus() {
    return REGEN_PER_SECOND;
  }
}
