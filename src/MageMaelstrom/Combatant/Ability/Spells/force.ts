import { Coordinate, MovementDirection } from "../../../Arena";
import { mmForce } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { FullSpellTarget, Spell } from "../spell";

const DAMAGE = 10;
const DISTANCE = 3;

export class Force extends Spell {
  public constructor() {
    super({
      type: "force",
      cooldown: 300,
      manaCost: 3,
      range: 1,
      targetTypes: ["direction", "entrant"],
      desc: {
        icon: mmForce,
        name: "Force",
        description: `Deal ${DAMAGE} damage to an enemy target and push them ${DISTANCE} tiles away`,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: MovementDirection | Entrant,
    gameManager: GameManager
  ): void {
    let actualTarget =
      typeof target == "string"
        ? gameManager.getEntrantAt(
            Coordinate.getSide(caster.getCoords(), target)
          )
        : target;

    if (!actualTarget) {
      return;
    }
    actualTarget.takeDamage(DAMAGE, caster, "attack", "force");

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      target: actualTarget.getCombatantInfo(),
      damage: DAMAGE,
      remainingHealth: actualTarget.getHealth(),
      spellIcon: mmForce,
    });

    const pushDir = caster
      .getCoords()
      .getRelativeDirectionOf(actualTarget.getCoords());

    for (let j = 0; j < DISTANCE; j++) {
      if (gameManager.getMoveResult(actualTarget, pushDir) === "Success") {
        actualTarget.move(pushDir);
      } else {
        return;
      }
    }
  }
}
