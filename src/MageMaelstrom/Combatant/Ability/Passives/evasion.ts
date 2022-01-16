import { Passive } from "..";
import { mmEvasion } from "../../../Common/Icon";
import { DamageType } from "../../entrant";

const CHANCE = 0.18;

export class Evasion extends Passive {
  public constructor() {
    super({
      type: "evasion",
      desc: {
        name: "Evasion",
        category: "defensive",
        description: `${CHANCE * 100}% chance to dodge incoming attacks`,
        icon: mmEvasion,
      },
    });
  }

  public override rollForEvasion(): boolean {
    return Math.random() < CHANCE;
  }
}
