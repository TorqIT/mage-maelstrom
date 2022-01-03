import { Passive, StatusEffect } from "..";
import { mmFrost } from "../../../Common/Icon";
import { invertPercentage } from "../../../Common/labels";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";

const MANA_REGEN = 2;
const SLOW = 0.85;

export class Frost extends Passive {
  public constructor() {
    super({
      type: "frost",
      desc: {
        name: "Frost Aura",
        description: `+${MANA_REGEN} mana regen. Enemies standing next to you are slowed by ${invertPercentage(
          SLOW
        )}%`,
        icon: mmFrost,
      },
    });
  }

  public override getManaRegenBonus() {
    return MANA_REGEN;
  }

  public override update(self: Entrant, gameManager: GameManager): void {
    const adjacentEnemies = gameManager.getEntrantsInRadius(
      self.getCoords(),
      1.5,
      self.getTeamId(),
      "enemies"
    );

    adjacentEnemies.forEach((e) => e.applyStatusEffect(new FrostStatus()));
  }
}

class FrostStatus extends StatusEffect {
  public constructor() {
    super({
      type: "frost",
      duration: 50,
      isPositive: false,
      desc: {
        name: "Frost",
        description: `Slowed by ${invertPercentage(SLOW)}%`,
        icon: mmFrost,
      },
    });
  }

  public override getTurnSpeedMultiplier(): number {
    return SLOW;
  }
}
