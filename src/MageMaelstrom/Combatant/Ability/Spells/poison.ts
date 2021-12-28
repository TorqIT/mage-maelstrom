import { StatusEffect } from "..";
import { mmPoison } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { SpellLog } from "../../../Logic";
import { Entrant } from "../../entrant";
import { FullSpellTarget, isCoordinate, Spell } from "../spell";

const DAMAGE = 10;
const SECONDS = 5;

export class Poison extends Spell {
  public constructor() {
    super({
      desc: {
        icon: mmPoison,
        name: "Poison",
        description: `Poisons the target for ${DAMAGE} damage per second for ${SECONDS} seconds`,
      },
      type: "poison",
      cooldown: 500,
      manaCost: 10,
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

    target.applyStatusEffect(new Poisoned(caster));

    loggingManager.logSpell({
      attacker: caster.getCombatantInfo(),
      target: target.getCombatantInfo(),
      spellIcon: mmPoison,
    });
  }
}

export class Poisoned extends StatusEffect {
  private source: Entrant;

  public constructor(source: Entrant) {
    super({
      type: "poison",
      desc: {
        name: "Poisoned",
        description: `Take ${DAMAGE} damage per second for ${SECONDS} seconds`,
        icon: mmPoison,
      },

      duration: SECONDS * 100,
      isPositive: false,
    });

    this.source = source;
  }

  public override updateEffect(entrant: Entrant) {
    if (this.timer % 50 === 1) {
      entrant.takeDamage(DAMAGE / 2, this.source, "magic");
    }
  }
}
