import { StatusEffect } from "..";
import { mmPoison } from "../../../Common/Icon";
import { SpellLog, SpellResult } from "../../../Logic";
import { Entrant } from "../../entrant";
import { FullSpellTarget, Spell } from "../spell";

const DAMAGE = 10;
const SECONDS = 5;

export class Poison extends Spell {
  public constructor() {
    super({
      type: "poison",
      icon: mmPoison,
      name: "Poison",
      description: `Poisons the target for ${DAMAGE} damage per second for ${SECONDS} seconds`,
      cooldown: 500,
      manaCost: 10,
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

    target.applyStatusEffect(new Poisoned());
  }
}

export class Poisoned extends StatusEffect {
  public constructor()
  {
    super({
      type: "poison",
      name: "Poisoned",
      description: `Take ${DAMAGE} damage per second for ${SECONDS} seconds`,
      icon: mmPoison,
      duration: SECONDS * 100,
      isPositive: false
    })
  }

  public override updateEffect(entrant: Entrant) {
    if(this.timer % 50 === 1)
    {
     entrant.takeDamage(DAMAGE / 2);
    }
  }
}
