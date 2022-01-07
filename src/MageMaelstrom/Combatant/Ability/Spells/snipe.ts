import { Icon, mmSnipe } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { ChannelingStatus } from "../Statuses/channellingStatus";
import { FullSpellTarget, Spell } from "../spell";
import { StatusEffect } from "../statusEffect";

const DAMAGE = 50;
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
      new ChannelingStatus(AIM_TIME, "Snipe", mmSnipe, () => {
        target.takeDamage(DAMAGE, caster, "magic");

        loggingManager.logSpell({
          caster: caster.getCombatantInfo(),
          target: target.getCombatantInfo(),
          spellIcon: mmSnipe,
          damage: DAMAGE,
          remainingHealth: target.getHealth(),
        });
      })
    );

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      spellIcon: mmSnipe,
    });
  }
}
