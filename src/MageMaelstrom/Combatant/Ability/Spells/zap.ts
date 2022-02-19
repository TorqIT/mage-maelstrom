import { Spell, StatusEffect } from "..";
import { mmZap } from "../../../Common/Icon";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { FullSpellTarget } from "../spell";

const DAMAGE = 25;
const BOUNCE_RANGE = 2.5;
const BOUNCE_DAMAGE = 15;

export class Zap extends Spell {
  public constructor() {
    super({
      type: "zap",
      cooldown: 150,
      manaCost: 8,
      range: 3,
      targetTypes: "entrant",
      desc: {
        name: "Zap",
        description:
          `Zap a target for ${DAMAGE} damage, statically charging them, causing any enemy that comes within ` +
          `${BOUNCE_RANGE} range of them to also get zapped for ${BOUNCE_DAMAGE} damage`,
        category: "damage",
        icon: mmZap,
        flavorText: "Don't touch any monitors",
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: Entrant,
    gameManager: GameManager
  ): void {
    caster.dealMagicDamage(target, DAMAGE, "zap", mmZap);
    target.applyStatusEffect(new Charged(caster), caster);
  }
}

class Charged extends StatusEffect {
  private source: Entrant;

  public constructor(source: Entrant) {
    super({
      type: "charged",
      duration: 9999999,
      isPositive: false,
      desc: {
        name: "Charged",
        description: `Zap anyone who comes within ${BOUNCE_RANGE} range of you for ${BOUNCE_DAMAGE} damage`,
        icon: mmZap,
        flavorText: "Don't touch any monitors",
      },
    });

    this.source = source;
  }

  public updateEffect(entrant: Entrant, gameManager: GameManager): void {
    if (this.timer % 10 === 0) {
      const teamMates = gameManager
        .getEntrantsInRadius(
          entrant.getCoords(),
          BOUNCE_RANGE,
          entrant.getTeamId(),
          "allies"
        )
        .filter((e) => e.getId() !== entrant.getId());

      if (teamMates.length > 0) {
        let closest = teamMates[0];
        let closestDistance = entrant
          .getCoords()
          .getSquaredDistance(closest.getCoords());

        for (let j = 1; j < teamMates.length; j++) {
          const dist = entrant
            .getCoords()
            .getSquaredDistance(teamMates[j].getCoords());

          if (dist > closestDistance) {
            closestDistance = dist;
            closest = teamMates[j];
          }
        }

        this.source.dealMagicDamage(closest, BOUNCE_DAMAGE, "zap", mmZap);
        this.forceFinish();
      }
    }
  }
}
