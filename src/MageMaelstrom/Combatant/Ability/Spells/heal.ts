import { mmHeal } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { FullSpellTarget, isCoordinate, Spell } from "../spell";

const HEAL_AMOUNT = 40;

export class Heal extends Spell {
  public constructor() {
    super({
      type: "heal",
      cooldown: 500,
      manaCost: 10,
      range: 6,
      targetTypes: ["entrant", "nothing"],
      desc: {
        name: "Heal",
        category: "restoration",
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
      target.heal(HEAL_AMOUNT);
    } else {
      caster.heal(HEAL_AMOUNT);
    }

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      target: target ? target.getCombatantInfo() : undefined,
      damage: -HEAL_AMOUNT,
      remainingHealth: (target ?? caster).getHealth(),
      spellIcon: mmHeal,
    });
  }
}
