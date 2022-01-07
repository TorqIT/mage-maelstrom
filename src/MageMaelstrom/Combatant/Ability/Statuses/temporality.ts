import { StatusEffect } from "..";
import { mmClock } from "../../../Common/Icon";
import { Entrant } from "../../entrant";

export class Temporality extends StatusEffect {
  public constructor(duration: number) {
    super({
      type: "temporality",
      duration,
      isPositive: false,
      undispellable: true,
      desc: {
        name: "Temporality",
        description: `This entity will dissipate after ${
          duration / 100
        } seconds`,
        icon: mmClock,
      },
    });
  }

  public override updateEffect(entrant: Entrant): void {
    if (this.timer === 1) {
      entrant.takeDamage(entrant.getHealth(), entrant, "pure");
    }
  }
}
