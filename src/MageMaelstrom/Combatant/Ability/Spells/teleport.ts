import { Spell } from "..";
import { Coordinate } from "../../../Arena";
import { mmTeleport } from "../../../Common/Icon";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";
import { ChannelingStatus } from "../Statuses/channellingStatus";
import { FullSpellTarget } from "../spell";

const CHANNEL_TIME = 200;
const INITIAL_COOLDOWN = 300;

export class Teleport extends Spell {
  public constructor() {
    super({
      type: "teleport",
      cooldown: 1500,
      manaCost: 15,
      initialCooldown: INITIAL_COOLDOWN,
      targetTypes: "coordinate",
      desc: {
        name: "Teleport",
        category: "mobility",
        description:
          `After channeling for ${
            CHANNEL_TIME / 100
          } second(s), teleport to any coordinate on the arena. ` +
          `Fails if someone's already standing there.`,
        notes: [`Starts on a ${INITIAL_COOLDOWN / 100} second cooldown`],
        icon: mmTeleport,
        flavorText: "No telefragging! Sorry!",
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: Coordinate,
    gameManager: GameManager
  ): void {
    caster.applyStatusEffect(
      new ChannelingStatus(CHANNEL_TIME, "Teleport", mmTeleport, () => {
        if (gameManager.isEmpty(target)) {
          caster.getCoords().teleportTo(target);
        }
      }),
      caster
    );
  }
}
