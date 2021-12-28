import { mmHeal } from "../../../Common/Icon";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { FullSpellTarget, isCoordinate, Spell } from "../spell";

const HEAL_AMOUNT = 30;

export class Heal extends Spell {
  public constructor() {
    super({
      type: "heal",
      cooldown: 1000,
      manaCost: 10,
      range: 6,
      targetTypes: "entrant",
      desc: {
        name: "Heal",
        description: `Heal the target for ${HEAL_AMOUNT} health`,
        icon: mmHeal,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: FullSpellTarget,
    gameManager: GameManager
  ): void {
    if (typeof target === "string" || isCoordinate(target)) {
      return;
    }

    if (target) {
      target.takeDamage(-HEAL_AMOUNT, caster, "pure");
    } else {
      caster.takeDamage(-HEAL_AMOUNT, caster, "pure");
    }
  }
}
