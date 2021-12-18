import { Ability } from "./ability";

export abstract class Passive extends Ability {
  public getMaxStatAdjustment() {
    return 0;
  }

  public rollForCrit() {
    return false;
  }
}
