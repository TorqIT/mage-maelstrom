import { Icon, mmSnipe } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { ChannelingStatus } from "../Statuses/channellingStatus";
import { FullSpellTarget, Spell } from "../spell";
import { StatusEffect } from "../statusEffect";

const DAMAGE = 75;
const AIM_TIME = 150;

export class Snipe extends Spell {
  public constructor() {
    super({
      type: "snipe",
      cooldown: 1000,
      manaCost: 30,
      targetTypes: "entrant",
      desc: {
        name: "Snipe",
        category: "damage",
        description: `Aim for ${
          AIM_TIME / 100
        } seconds and then fire a bolt that does ${DAMAGE} damage. Unlimited range.`,
        icon: mmSnipe,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: Entrant,
    gameManager: GameManager
  ): void {
    caster.applyStatusEffect(
      new ChannelingStatus(AIM_TIME, "Snipe", mmSnipe, () =>
        caster.dealMagicDamage(target, DAMAGE, "snipe", mmSnipe)
      ),
      caster
    );

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      spellIcon: mmSnipe,
    });
  }
}
