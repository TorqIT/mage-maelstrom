import { mmFireball } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { SpellLog } from "../../../Logic";
import { Entrant } from "../../entrant";
import { FullSpellTarget, isCoordinate, Spell } from "../spell";

const DAMAGE = 30;

export class Fireball extends Spell {
  public constructor() {
    super({
      desc: {
        name: "Fireball",
        description: `Throw out a long range fireball that deals ${DAMAGE} damage`,
        icon: mmFireball,
      },
      type: "fireball",
      cooldown: 300,
      manaCost: 20,
      range: 5,
      targetTypes: "entrant",
    });
  }

  protected castSpell(
    caster: Entrant,
    target: FullSpellTarget
  ): SpellLog | undefined {
    if (!target || typeof target === "string" || isCoordinate(target)) {
      return;
    }

    target.takeDamage(DAMAGE, caster, "magic");

    loggingManager.logSpell({
      attacker: caster.getCombatantInfo(),
      target: target.getCombatantInfo(),
      damage: DAMAGE,
      remainingHealth: target.getHealth(),
      spellIcon: mmFireball,
    });
  }
}
