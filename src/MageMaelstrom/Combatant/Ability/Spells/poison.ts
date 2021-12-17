import { mmPoison } from "../../../Common/Icon";
import { SpellLog } from "../../../Logic";
import { Entrant } from "../../entrant";
import { buildStatusEffect } from "../../StatusEffect";
import { FullSpellTarget, Spell } from "../spell";

export class Poison extends Spell {
  public constructor() {
    super({
      type: "poison",
      icon: mmPoison,
      name: "Poison",
      description: "Poisons the target for 10 damage per second for 5 seconds",
      cooldown: 500,
      manaCost: 10,
      range: 5,
    });
  }

  protected castSpell(
    caster: Entrant,
    target: FullSpellTarget
  ): SpellLog | undefined {
    if (!target || typeof target === "string") {
      return;
    }

    target.applyStatusEffect(buildStatusEffect("poison"));
  }
}
