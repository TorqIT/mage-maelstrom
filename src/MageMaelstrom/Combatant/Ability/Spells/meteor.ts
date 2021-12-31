import { Spell } from "..";
import { Coordinate } from "../../../Arena";
import { mmMeteor } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { ChannelingStatus } from "../channellingStatus";

const DAMAGE = 100;
const DELAY = 300;
const RADIUS = 3.5;

export class Meteor extends Spell {
  public constructor() {
    super({
      type: "meteor",
      cooldown: 3000,
      manaCost: 100,
      range: 8,
      targetTypes: "coordinate",
      desc: {
        name: "Meteor",
        description:
          `Channel for ${DELAY / 100} seconds to summon a meteor that ` +
          `deals ${DAMAGE} damage in a ${RADIUS} radius`,
        icon: mmMeteor,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: Coordinate,
    gameManager: GameManager
  ): void {
    caster.applyStatusEffect(
      new ChannelingStatus(DELAY, "Meteor", mmMeteor, () => {
        const entrants = gameManager.getEntrantsInRadius(
          target,
          RADIUS,
          caster.getTeamId(),
          "enemies"
        );

        entrants.forEach((e) => {
          e.takeDamage(DAMAGE, caster, "magic");

          loggingManager.logSpell({
            caster: caster.getCombatantInfo(),
            spellIcon: mmMeteor,
            target: e.getCombatantInfo(),
            damage: DAMAGE,
            remainingHealth: e.getHealth(),
          });
        });
      })
    );

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      spellIcon: mmMeteor,
    });
  }
}
