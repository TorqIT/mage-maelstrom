import { mmFireball } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { SpellLog, SpellResult } from "../../../Logic";
import { Entrant } from "../../entrant";
import { FullSpellTarget, Spell } from "../spell";

const DAMAGE = 30;

export class Fireball extends Spell {
  public constructor() {
    super({
      type: "fireball",
      name: "Fireball",
      description: `Throw out a long range fireball that deals ${DAMAGE} damage`,
      flavorText: "Now I have the funny text!!",
      icon: mmFireball,
      cooldown: 300,
      manaCost: 20,
      range: 5,
    });
  }

  protected canCastSpell(
    caster: Entrant,
    target: FullSpellTarget
  ): SpellResult {
    if (!target || typeof target === "string") {
      return "WrongTargetType";
    }

    return "Success";
  }

  protected castSpell(
    caster: Entrant,
    target: FullSpellTarget
  ): SpellLog | undefined {
    if (!target || typeof target === "string") {
      return;
    }

    target.takeDamage(DAMAGE);

    loggingManager.logSpell({
      attacker: caster.getId(),
      target: target.getId(),
      damage: DAMAGE,
      remainingHealth: target.getHealth(),
      spellIcon: mmFireball,
    });
  }
}
