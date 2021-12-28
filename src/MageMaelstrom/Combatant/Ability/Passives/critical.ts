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
        description: `Every attack has a ${
          CRIT_CHANCE * 100
        }% to critical hit for double damage`,
      },
    });
  }

  public override rollForCrit() {
    return Math.random() < CRIT_CHANCE;
  }
}
