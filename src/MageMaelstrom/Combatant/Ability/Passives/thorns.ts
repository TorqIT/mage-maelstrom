import { mmThorns } from "../../../Common/Icon";
import { invertPercentage } from "../../../Common/labels";
import { loggingManager } from "../../../Logging";
import { DamageType, Entrant } from "../../entrant";
import { Passive } from "../passive";

const DAMAGE_MULT = 0.9;
const MIN_DAMAGE = 3;
const MAX_DAMAGE = 4;

export class Thorns extends Passive {
  public constructor() {
    super({
      type: "thorns",
      desc: {
        name: "Thorn Armor",
        category: "defensive",
        description: `Reduces attack damage taken by ${invertPercentage(
          DAMAGE_MULT
        )}% and deals ${MIN_DAMAGE} to ${MAX_DAMAGE} damage every time you're attacked`,
        icon: mmThorns,
      },
    });
  }

  public override getDamageTakenMultiplier(damageType: DamageType) {
    return damageType === "attack" ? DAMAGE_MULT : 1;
  }

  public override onTakeDamage(
    attacker: Entrant,
    you: Entrant,
    type: DamageType
  ) {
    if (type === "attack") {
      you.dealPureDamage(
        attacker,
        MIN_DAMAGE + Math.random() * (MAX_DAMAGE - MIN_DAMAGE),
        "thorns",
        mmThorns
      );
    }
  }
}
