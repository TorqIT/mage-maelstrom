import { Spell, StatusEffect } from "..";
import { mmHealthPotion } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { ChannelingStatus } from "../Statuses/channellingStatus";
import { FullSpellTarget } from "../spell";

const DRINK_TIME = 100;
const HEAL_PER_SECOND = 20;
const DURATION = 300;

export class HealthPotion extends Spell {
  public constructor() {
    super({
      type: "potion",
      cooldown: 999999999999999,
      manaCost: 0,
      targetTypes: ["entrant", "nothing"],
      range: 2,
      desc: {
        name: "Health Potion",
        category: "restoration",
        description:
          `Drink down a health potion after ${DRINK_TIME / 100}s and heal ` +
          `${HEAL_PER_SECOND} health per second for ${
            DURATION / 100
          } seconds. Single use. ` +
          `Healing is half regen, half magic.`,
        icon: mmHealthPotion,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: Entrant | undefined,
    gameManager: GameManager
  ): void {
    caster.applyStatusEffect(
      new ChannelingStatus(DRINK_TIME, "Health Potion", mmHealthPotion, () => {
        (target ?? caster).applyStatusEffect(new HealthPotionStatus(), caster);
      }),
      caster
    );

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      spellIcon: mmHealthPotion,
      target: target?.getCombatantInfo(),
    });
  }
}

class HealthPotionStatus extends StatusEffect {
  public constructor() {
    super({
      type: "potion",
      duration: DURATION,
      isPositive: true,
      desc: {
        name: "Health Potion",
        description: `Heal ${HEAL_PER_SECOND} health per second`,
        icon: mmHealthPotion,
      },
    });
  }

  public override getHealthRegenBonus(): number {
    return HEAL_PER_SECOND / 2;
  }

  public override updateEffect(entrant: Entrant): void {
    if (this.timer % 50 === 1) {
      entrant.heal(HEAL_PER_SECOND / 4);
    }
  }
}
