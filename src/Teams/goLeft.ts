import { Combatant } from "../MageMaelstrom";
import {
  CombatantDefinition,
  CombatantStatus,
  Action,
  actions,
} from "../MageMaelstrom/Combatant";
import { Helpers } from "../MageMaelstrom/Logic";

export class GoLeft extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "BIG",
      icon: "/burst.png",

      strength: 5,
      agility: 5,
      intelligence: 5,
    };
  }
  public init(): void {}
  public act(helpers: Helpers, visibleEnemies: CombatantStatus[]): Action {
    return actions.move("left");
  }
}
