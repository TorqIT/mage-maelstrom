import { Spell } from "..";
import { Coordinate } from "../../../Arena";
import { mmMeteor } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { ChannelingStatus } from "../Statuses/channellingStatus";

const DAMAGE = 100;
const DELAY = 300;
const RADIUS = 3.5;
const INITIAL_COOLDOWN = 800;

export class Meteor extends Spell {
  public constructor() {
    super({
      type: "meteor",
      cooldown: 3000,
      initialCooldown: INITIAL_COOLDOWN,
      manaCost: 100,
      range: 8,
      targetTypes: "coordinate",
      desc: {
        name: "Meteor",
        category: "damage",
        description:
          `Channel for ${DELAY / 100} seconds to summon a meteor that ` +
          `deals ${DAMAGE} damage in a ${RADIUS} radius. Starts on a ${
            INITIAL_COOLDOWN / 100
          } ` +
          `cooldown.`,
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
          e.takeDamage(DAMAGE, caster, "magic", "meteor");

          loggingManager.logSpell({
            caster: caster.getCombatantInfo(),
            spellIcon: mmMeteor,
            target: e.getCombatantInfo(),
            damage: DAMAGE,
            remainingHealth: e.getHealth(),
          });
        });
      }),
      caster
    );

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      spellIcon: mmMeteor,
    });
  }
}
