import { Spell } from "..";
import { mmDispel } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { FullSpellTarget } from "../spell";

export class Dispel extends Spell {
  public constructor() {
    super({
      type: "dispel",
      cooldown: 800,
      manaCost: 12,
      range: 5,
      targetTypes: ["entrant", "nothing"],
      desc: {
        name: "Dispel",
        category: "restoration",
        description:
          "If cast on an ally, clear all negative status effects. If cast on " +
          "an enemy, clear all positive status effects. Channeling cannot be dispelled.",
        icon: mmDispel,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: Entrant | undefined,
    gameManager: GameManager
  ): void {
    const actualTarget = target ?? caster;

    actualTarget.clearStatusEffects(
      caster.getTeamId() === actualTarget.getTeamId()
    );

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      spellIcon: mmDispel,
      target: actualTarget.getCombatantInfo(),
    });
  }
}
