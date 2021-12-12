import { nextId } from "../../Common";
import { icons } from "../../Common/Icon";
import { LogType, SpellLog } from "../../Logic";
import { Entrant } from "../entrant";
import { AbilityType, FullSpellTarget, Spell } from "./ability";

export class Fireball extends Spell {
  public constructor() {
    super(AbilityType.Fireball, 1000, 20, 5);
  }

  protected castSpell(
    caster: Entrant,
    target: FullSpellTarget
  ): SpellLog | undefined {
    if (!target || typeof target === "string") {
      return;
    }

    target.takeDamage(20);

    return {
      id: nextId(),
      type: LogType.Spell,
      attacker: caster.getId(),
      target: target.getId(),
      damage: 20,
      remainingHealth: target.getHealth(),
      spellIcon: icons.fireball,
    };
  }
}
