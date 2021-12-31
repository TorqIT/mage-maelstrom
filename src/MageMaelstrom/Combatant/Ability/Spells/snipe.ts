import { Icon, mmSnipe } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
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
    caster.applyStatusEffect(new SnipeChargeUp(target));

    loggingManager.logSpell({
      attacker: caster.getCombatantInfo(),
      spellIcon: mmSnipe,
    });
  }
}

class SnipeChargeUp extends StatusEffect {
  private target: Entrant;

  public constructor(target: Entrant) {
    super({
      type: "snipe",
      duration: AIM_TIME,
      isPositive: true,
      desc: {
        name: "Taking aim...",
        description: "Channeling a Snipe bolt!",
        icon: mmSnipe,
      },
    });

    this.target = target;
  }

  public override getTurnSpeedMultiplier() {
    return 0;
  }

  public override updateEffect(entrant: Entrant) {
    if (this.timer === 1) {
      this.target.takeDamage(DAMAGE, entrant, "magic");

      loggingManager.logSpell({
        attacker: entrant.getCombatantInfo(),
        target: this.target.getCombatantInfo(),
        spellIcon: mmSnipe,
        damage: DAMAGE,
        remainingHealth: this.target.getHealth(),
      });
    }
  }
}
