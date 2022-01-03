import { Passive } from "..";
import { DamageType, Entrant } from "../..";
import { mmManaSteal } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";

const MANA_STEAL = 1;

export class ManaSteal extends Passive {
  public constructor() {
    super({
      type: "manasteal",
      desc: {
        name: "Mana Steal",
        description: `Steal ${MANA_STEAL} mana each time you attack a target (if they have mana to steal)`,
        icon: mmManaSteal,
      },
    });
  }

  public override onDealDamage(me: Entrant, target: Entrant, type: DamageType) {
    if (type !== "attack") {
      return;
    }

    const stolenMana = Math.min(MANA_STEAL, target.getMana());

    me.drainMana(-stolenMana);
    target.drainMana(stolenMana);

    loggingManager.logSpell({
      caster: me.getCombatantInfo(),
      target: target.getCombatantInfo(),
      spellIcon: mmManaSteal,
    });
  }
}
