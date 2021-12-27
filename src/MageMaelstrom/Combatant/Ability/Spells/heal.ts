import { mmHeal } from "../../../Common/Icon";
import { SpellResult } from "../../../Logic";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { FullSpellTarget, Spell } from "../spell";

const HEAL_AMOUNT = 30;

export class Heal extends Spell {
  public constructor() {
    super({
      type: "heal",
      cooldown: 1000,
      manaCost: 10,
      range: 6,
      desc: {
        name: "Heal",
        description: `Heal the target for ${HEAL_AMOUNT} health`,
        icon: mmHeal,
      },
    });
  }

  protected canCastSpell(
    caster: Entrant,
    target: FullSpellTarget,
    gameManager: GameManager
  ): SpellResult {
    if (typeof target === "string") {
      return "WrongTargetType";
    }

    return "Success";
  }

  protected castSpell(
    caster: Entrant,
    target: FullSpellTarget,
    gameManager: GameManager
  ): void {
    if (typeof target === "string") {
      return;
    }

    if (target) {
      target.takeDamage(-HEAL_AMOUNT);
    } else {
      caster.takeDamage(-HEAL_AMOUNT);
    }
  }
}
