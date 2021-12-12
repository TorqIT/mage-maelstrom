import { nextId } from "../../Common";
import { icons } from "../../Common/Icon";
import { LogType, SpellLog } from "../../Logic";
import { Entrant } from "../entrant";
import { AbilityType, FullSpellTarget, Spell } from "./ability";

export class Fireball extends Spell {
  public constructor() {
    super(AbilityType.Fireball, 300, 20, 5);
  }

  protected castSpell(
    caster: Entrant,
    target: FullSpellTarget
  ): SpellLog | undefined {
    if (!target || typeof target === "string") {
      return;
    }

    target.takeDamage(30);

    return {
      id: nextId(),
      type: LogType.Spell,
      attacker: caster.getId(),
      target: target.getId(),
      damage: 30,
      remainingHealth: target.getHealth(),
      spellIcon: icons.fireball,
    };
  }
}
