import { mmPoison } from "../../../Common/Icon";
import { Entrant } from "../../entrant";
import { StatusEffect } from "../statusEffect";

const DAMAGE = 100;
const SECONDS = 5;

export class Poisoned extends StatusEffect {
  public constructor()
  {
    super({
      type: "poison",
      name: "Poisoned",
      description: `Take ${DAMAGE} damage per second for ${SECONDS} seconds`,
      icon: mmPoison,
      duration: SECONDS * 100,
      isPositive: false
    })
  }

  public override updateEffect(entrant: Entrant) {
    if(this.timer % 50 === 1)
    {
     entrant.takeDamage(DAMAGE / 2);
    }
  }
}