import { Passive } from "..";
import { mmMind } from "../../../Common/Icon";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";

const COOLDOWN_MULT = 1.2;
const TURN_SPEED = 1.1;
const SEARCH_RADIUS = 2;

export class PresenceOfMind extends Passive {
  private enemyClose = false;

  public constructor() {
    super({
      type: "mind",
      desc: {
        name: "Presence of Mind",
        category: "buffs",
        description: `If no enemy is within a radius of ${SEARCH_RADIUS}, +${(
          (COOLDOWN_MULT - 1) *
          100
        ).toFixed()}% cooldown rate. Otherwise, increase turn speed by ${(
          (TURN_SPEED - 1) *
          100
        ).toFixed()}%`,
        icon: mmMind,
        flavorText: "PANIC",
      },
    });
  }

  public override update(self: Entrant, gameManager: GameManager): void {
    this.enemyClose =
      gameManager.getEntrantsInRadius(
        self.getCoords(),
        SEARCH_RADIUS,
        self.getTeamId(),
        "enemies"
      ).length > 0;
  }

  public override getTurnSpeedMultiplier(): number {
    return this.enemyClose ? TURN_SPEED : 1;
  }

  public override getCooldownSpeedMultiplier(): number {
    return this.enemyClose ? 1 : COOLDOWN_MULT;
  }
}
