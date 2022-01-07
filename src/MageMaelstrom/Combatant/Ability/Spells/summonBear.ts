import { mmBear } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { SpellResult } from "../../../Logic";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { BearCombatant } from "../../InternalCombatants";
import { Passive } from "../passive";
import { FullSpellTarget, Spell } from "../spell";
import { Temporality } from "../Statuses/temporality";

const DURATION = 4000;

export class SummonBear extends Spell {
  public constructor() {
    super({
      desc: {
        icon: mmBear,
        name: "Summon Bear",
        description:
          `Summon a 10/8/5 bear that lasts for ${
            DURATION / 100
          } seconds. Lumbers around slowly but moves quicker ` +
          "when an enemy is close by.",
      },
      type: "bear",
      manaCost: 45,
      cooldown: 3000,
      targetTypes: "nothing",
    });
  }

  protected castSpell(
    caster: Entrant,
    target: FullSpellTarget,
    gameManager: GameManager
  ): void {
    const bear = gameManager.addCombatant(
      BearCombatant,
      caster.getTeamId(),
      caster.getCoords()
    );

    bear.addPassive(new BearPassive());
    bear.applyStatusEffect(new Temporality(DURATION));

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      spellIcon: mmBear,
    });
  }
}

class BearPassive extends Passive {
  private frenzy = false;

  public constructor() {
    super({
      type: "bearPassive",
    });
  }

  public override update(self: Entrant, gameManager: GameManager) {
    const enemyTeam = gameManager.getEnemyTeam(self.getTeamId());
    this.frenzy = enemyTeam.entrants.some((e) => self.canSee(e));
  }

  public override getVisionAdjustment() {
    return -1;
  }

  public override getTurnSpeedMultiplier() {
    return this.frenzy ? 4 / 3 : 0.8;
  }
}
