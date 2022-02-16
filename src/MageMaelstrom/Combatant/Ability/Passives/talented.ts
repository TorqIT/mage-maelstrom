import { mmTalented } from "../../../Common/Icon";
import { Passive } from "../passive";

const MAX_STAT_BOOST = 7;

export class Talented extends Passive {
  public constructor() {
    super({
      type: "talented",
      desc: {
        name: "Talented",
        category: "buffs",
        description: `+${MAX_STAT_BOOST} Max Stats`,
        icon: mmTalented,
      },
    });
  }

  public override getMaxStatAdjustment() {
    return MAX_STAT_BOOST;
  }
}
