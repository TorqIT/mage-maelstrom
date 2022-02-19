import { StatusEffect } from "..";
import { mmPoison } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { SpellLog } from "../../../Logic";
import { DamageType, Entrant } from "../../entrant";
import { FullSpellTarget, isCoordinate, Spell } from "../spell";

const DAMAGE = 10;
const SECONDS = 6;
const DAMAGE_MULT = 1.15;

export class Poison extends Spell {
  public constructor() {
    super({
      desc: {
        icon: mmPoison,
        name: "Poison",
        category: "damage",
        description:
          `Poisons the target for ${DAMAGE} damage per second for ${SECONDS} seconds ` +
          `and increasing the attack damage they take by ${(
            (DAMAGE_MULT - 1) *
            100
          ).toFixed(0)}%`,
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
        description: `Take ${DAMAGE} damage per second for ${SECONDS} seconds and take ${(
          (DAMAGE_MULT - 1) *
          100
        ).toFixed(0)}% more attack damage`,
        icon: mmPoison,
      },

      duration: SECONDS * 100,
      isPositive: false,
    });

    this.source = source;
  }

  public getDamageTakenMultiplier(damageType: DamageType): number {
    return damageType === "attack" ? DAMAGE_MULT : 1;
  }

  public override updateEffect(entrant: Entrant) {
    if (this.timer % 50 === 1) {
      this.source.dealMagicDamage(
        entrant,
        DAMAGE / 2,
        "poison",
        mmPoison,
        false
      );
    }
  }
}
