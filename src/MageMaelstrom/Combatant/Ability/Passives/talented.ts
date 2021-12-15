import { Passive } from "../passive";

export class Talented extends Passive{
  public constructor()
  {
    super("talented")
  }

  public override getMaxStatAdjustment() {
    return 10;
  }
}