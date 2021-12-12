import { nextId } from "../../Common";
import { icons } from "../../Common/Icon";
import { LogType, SpellLog } from "../../Logic";
import { Entrant } from "../entrant";
import { AbilityType, Spell } from "./ability";

export class Fireball extends Spell {
  public constructor(owner: Entrant) {
    super(AbilityType.Fireball, owner, 1000, 20, 5);
  }

  public castSpell(entrant: Entrant): SpellLog {
    entrant.takeDamage(20);

    return {
      id: nextId(),
      type: LogType.Spell,
      attacker: this.owner.getId(),
      target: entrant.getId(),
      damage: 20,
      remainingHealth: entrant.getHealth(),
      spellIcon: icons.fireball,
    };
  }
}
