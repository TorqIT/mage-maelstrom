import { mmCrit } from "../../../Common/Icon";
import { Passive } from "../passive";

const CRIT_CHANCE = 0.25;

export class Critical extends Passive {
  public constructor() {
    super({
      type: "critical",
      desc: {
        name: "Critical",
        icon: mmCrit,
        category: "damage",
        description: `Every attack has a ${
          CRIT_CHANCE * 100
        }% chance to critical hit for double damage`,
        notes: [
          "Stacking only increases the chance that a critical occurs. You cannot roll multiple crits for one attack.",
        ],
      },
    });
  }

  public override rollForCrit() {
    return Math.random() < CRIT_CHANCE;
  }
}
