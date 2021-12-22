import { mmTalented } from "../../../Common/Icon";
import { Passive } from "../passive";

const MAX_STAT_BOOST = 10;

export class Talented extends Passive {
  public constructor() {
    super({
      type: "talented",
      desc: {
      name: "Talented",
      description: `+${MAX_STAT_BOOST} Max Stats`,
      icon: mmTalented}
    });
  }

  public override getMaxStatAdjustment() {
    return MAX_STAT_BOOST;
  }
}
