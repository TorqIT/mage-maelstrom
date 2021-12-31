import { Spell } from "..";
import { MovementDirection } from "../../../Arena";
import { mmDash } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { FullSpellTarget } from "../spell";

const DISTANCE = 4;

export class Dash extends Spell {
  public constructor() {
    super({
      type: "dash",
      cooldown: 200,
      manaCost: 3,
      targetTypes: "direction",
      desc: {
        name: "Dash",
        description: `Leap forward ${DISTANCE} tiles`,
        icon: mmDash,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: MovementDirection,
    gameManager: GameManager
  ): void {
    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      spellIcon: mmDash,
    });

    for (let j = 0; j < DISTANCE; j++) {
      if (gameManager.getMoveResult(caster, target) === "Success") {
        caster.move(target);
      } else {
        return;
      }
    }
  }
}
