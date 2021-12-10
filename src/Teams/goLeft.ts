import { Combatant } from "../MageMaelstrom";
import {
  CombatantDefinition,
  Action,
  actions,
  ReadonlyEntrantStatus,
} from "../MageMaelstrom/Combatant";
import { Helpers } from "../MageMaelstrom/Logic";

export class GoLeft extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "I GO LEFT",
      icon: "/burst.png",

      strength: 5,
      agility: 5,
      intelligence: 5,
    };
  }
  public init(): void {}
  public act(
    helpers: Helpers,
    visibleEnemies: ReadonlyEntrantStatus[]
  ): Action {
    return actions.move("left");
  }
}
