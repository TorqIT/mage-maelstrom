import { Passive } from "..";
import { mmRanged } from "../../../Common/Icon";

export class Ranged extends Passive {
  public constructor() {
    super({
      type: "ranged",
      desc: {
        name: "Ranged",
        category: "buffs",
        description: "Increases attack range to 2. Doesn't stack.",
        icon: mmRanged,
      },
    });
  }

  public override getAttackRange(): number {
    return 2;
  }
}
