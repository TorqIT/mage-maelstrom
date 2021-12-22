import { mmBear } from "../../../Common/Icon";
import { SpellResult } from "../../../Logic";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { BearCombatant } from "../../InternalCombatants";
import { Passive } from "../passive";
import { FullSpellTarget, Spell } from "../spell";

export class SummonBear extends Spell {
  public constructor() {
    super({
      desc: {
        icon: mmBear,
        name: "Summon Bear",
        description: "Summon a bear",
      },
      type: "bear",
      manaCost: 30,
      cooldown: 4000,
    });
  }

  protected canCastSpell(
    caster: Entrant,
    target: FullSpellTarget
  ): SpellResult {
    return "Success";
  }

  protected castSpell(
    caster: Entrant,
    target: FullSpellTarget,
    gameManager: GameManager
  ): void {
    gameManager.addCombatant(
      BearCombatant,
      caster.getTeamId(),
      caster.getCoords()
    );
  }
}
