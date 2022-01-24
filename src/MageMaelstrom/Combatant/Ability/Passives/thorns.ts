import { mmThorns } from "../../../Common/Icon";
import { invertPercentage } from "../../../Common/labels";
import { loggingManager } from "../../../Logging";
import { DamageType, Entrant } from "../../entrant";
import { Passive } from "../passive";

const DAMAGE_MULT = 0.85;
const THORN_DAMAGE = 3;

export class Thorns extends Passive {
  public constructor() {
    super({
      type: "thorns",
      desc: {
        name: "Thorn Armor",
        category: "defensive",
        description: `Reduces attack damage taken by ${invertPercentage(
          DAMAGE_MULT
        )}% and deals ${THORN_DAMAGE} every time you're attacked`,
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
      attacker.takeDamage(THORN_DAMAGE, you, "pure", "thorns");

      loggingManager.logSpell({
        caster: you.getCombatantInfo(),
        target: attacker.getCombatantInfo(),
        damage: THORN_DAMAGE,
        remainingHealth: attacker.getHealth(),
        spellIcon: mmThorns,
      });
    }
  }
}
