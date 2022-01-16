import { Spell, StatusEffect } from "..";
import { mmFlash } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { FullSpellTarget } from "../spell";

const DURATION = 150;

export class Flash extends Spell {
  public constructor() {
    super({
      type: "flash",
      cooldown: 1000,
      manaCost: 10,
      targetTypes: "nothing",
      desc: {
        name: "Flash",
        category: "buff",
        description: `Gain vision over the entire arena for ${
          DURATION / 100
        } second(s)`,
        icon: mmFlash,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: FullSpellTarget,
    gameManager: GameManager
  ): void {
    caster.applyStatusEffect(new FlashStatus(), caster);

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      spellIcon: mmFlash,
    });
  }
}

export class FlashStatus extends StatusEffect {
  public constructor() {
    super({
      type: "flash",
      duration: DURATION,
      isPositive: true,
      desc: {
        name: "Flash",
        description: `Gain vision over the entire arena`,
        icon: mmFlash,
      },
    });
  }

  public override getVisionAdjustment(): number {
    return 999;
  }
}
