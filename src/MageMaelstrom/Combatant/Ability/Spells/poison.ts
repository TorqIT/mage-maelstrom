import { StatusEffect } from "..";
import { mmPoison } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { SpellLog } from "../../../Logic";
import { Entrant } from "../../entrant";
import { FullSpellTarget, isCoordinate, Spell } from "../spell";

const DAMAGE = 10;
const SECONDS = 6;
const SLOW = 0.9;

export class Poison extends Spell {
  public constructor() {
    super({
      desc: {
        icon: mmPoison,
        name: "Poison",
        category: "damage",
        description:
          `Poisons the target for ${DAMAGE} damage per second for ${SECONDS} seconds ` +
          ` and slowing them by ${((1 - SLOW) * 100).toFixed(0)}%`,
      },
      type: "poison",
      cooldown: 600,
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

    target.applyStatusEffect(new Poisoned(caster), caster);

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
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
        description: `Take ${DAMAGE} damage per second for ${SECONDS} seconds and act ${(
          (1 - SLOW) *
          100
        ).toFixed(0)}% slower`,
        icon: mmPoison,
      },

      duration: SECONDS * 100,
      isPositive: false,
    });

    this.source = source;
  }

  public override getTurnSpeedMultiplier(): number {
    return SLOW;
  }

  public override updateEffect(entrant: Entrant) {
    if (this.timer % 50 === 1) {
      entrant.takeDamage(DAMAGE / 2, this.source, "magic", "poison");
    }
  }
}
