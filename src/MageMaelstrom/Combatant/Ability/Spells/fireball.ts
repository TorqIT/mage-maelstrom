import { mmFireball } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { SpellLog } from "../../../Logic";
import { Entrant } from "../../entrant";
import { FullSpellTarget, Spell } from "../spell";

export class Fireball extends Spell {
  public constructor() {
    super("fireball", 300, 20, 5);
  }

  protected castSpell(
    caster: Entrant,
    target: FullSpellTarget
  ): SpellLog | undefined {
    if (!target || typeof target === "string") {
      return;
    }

    target.takeDamage(30);

    loggingManager.logSpell({
      attacker: caster.getId(),
      target: target.getId(),
      damage: 30,
      remainingHealth: target.getHealth(),
      spellIcon: mmFireball,
    });
  }
}
