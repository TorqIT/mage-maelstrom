import { Spell } from "..";
import { mmBurst, mmForce } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { FullSpellTarget } from "../spell";

const DAMAGE = 60;

export class Burst extends Spell {
  public constructor() {
    super({
      type: "burst",
      cooldown: 1500,
      manaCost: 8,
      targetTypes: "nothing",
      desc: {
        name: "Burst",
        category: "damage",
        description:
          `Emit a great burst of energy, hitting all enemies standing next to you ` +
          `(including diagonally), dealing ${DAMAGE} damage and pushing them 2 tiles away.`,
        icon: mmBurst,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: undefined,
    gameManager: GameManager
  ): void {
    const enemies = gameManager.getEntrantsInRadius(
      caster.getCoords(),
      1.5,
      caster.getTeamId(),
      "enemies"
    );

    enemies.forEach((e) => {
      caster.dealMagicDamage(e, DAMAGE, "burst", mmBurst);

      const dir = caster.getCoords().getRelativeDirectionOf(e.getCoords());

      for (let j = 0; j < 2; j++) {
        if (gameManager.getMoveResult(e, dir) === "Success") {
          e.move(dir);
        }
      }
    });
  }
}
