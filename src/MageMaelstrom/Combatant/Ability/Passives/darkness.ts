import { Passive, StatusEffect } from "..";
import { mmDarkness } from "../../../Common/Icon";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";

const RADIUS = 3.5;
const VISION_REDUCTION = 1.5;

export class Darkness extends Passive {
  public constructor() {
    super({
      type: "darkness",
      desc: {
        name: "Aura of Darkness",
        description:
          `All enemies within a radius of ${RADIUS} of you have their ` +
          `vision reduced by ${VISION_REDUCTION}.`,
        notes: ["Doesn't stack."],
        category: "debuffs",
        icon: mmDarkness,
      },
    });
  }

  public override update(self: Entrant, gameManager: GameManager): void {
    gameManager
      .getEntrantsInRadius(
        self.getCoords(),
        RADIUS,
        self.getTeamId(),
        "enemies"
      )
      .forEach((e) => e.applyStatusEffect(new DarknessEffect(), self));
  }
}

class DarknessEffect extends StatusEffect {
  public constructor() {
    super({
      type: "darkness",
      duration: 50,
      isPositive: false,
      desc: {
        name: "Darkness",
        description: `Your vision is reduced by ${VISION_REDUCTION}`,
        icon: mmDarkness,
      },
    });
  }

  public override getVisionAdjustment(): number {
    return -VISION_REDUCTION;
  }
}
