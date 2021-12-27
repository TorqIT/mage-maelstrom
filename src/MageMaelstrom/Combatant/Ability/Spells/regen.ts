import { mmRegen } from "../../../Common/Icon";
import { SpellResult } from "../../../Logic";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { FullSpellTarget, Spell } from "../spell";
import { StatusEffect } from "../statusEffect";

const REGEN_PER_SECOND = 8;
const DURATION = 800;

export class Regen extends Spell{
  public constructor()
  {
    super({
      type: "regen",
      cooldown: 1600,
      manaCost: 14,
      range: 4,
      desc: {
        name: "Regen",
        description: `Increases the target's regeneration by ${REGEN_PER_SECOND}/s for ${DURATION / 100} seconds`,
        icon: mmRegen
      }
    })
  }

  protected canCastSpell(caster: Entrant, target: FullSpellTarget, gameManager: GameManager): SpellResult {
    if (typeof target === "string") {
      return "WrongTargetType";
    }

    return "Success";
  }
  protected castSpell(caster: Entrant, target: FullSpellTarget, gameManager: GameManager): void {
    if (typeof target === "string") {
      return;
    }

    if (target) {
      target.applyStatusEffect(new RegenStatus());
    } else {
      caster.applyStatusEffect(new RegenStatus());
    }
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
        description: `Health regeneration is increased by ${REGEN_PER_SECOND}/s`
      }
    })
  }

  public override getHealthRegenBonus() { return REGEN_PER_SECOND;}
}