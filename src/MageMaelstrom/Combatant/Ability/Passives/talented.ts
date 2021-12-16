import { mmTalented } from "../../../Common/Icon";
import { Passive } from "../passive";

export class Talented extends Passive {
  public constructor() {
    super("talented", mmTalented);
  }

  public override getMaxStatAdjustment() {
    return 10;
  }
}
