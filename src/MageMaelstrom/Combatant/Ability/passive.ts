import { Ability } from "./ability";

export class Passive extends Ability {
  public getMaxStatAdjustment() {
    return 0;
  }
}
