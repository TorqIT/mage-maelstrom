import { Combatant } from "../MageMaelstrom";
import {
  CombatantDefinition,
  Action,
  actions,
  ReadonlyEntrantStatus,
  SpellStatus,
} from "../MageMaelstrom/Combatant";
import { Helpers } from "../MageMaelstrom/Logic";

export class GoLeft extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "I GO LEFT",
      icon: "/burst.png",

      strength: 46,
      agility: 5,
      intelligence: 5,

      abilities: ["heal", "regen", "talented", "talented"],
    };
  }
  public init(): void {}
  public act(
    helpers: Helpers,
    you: ReadonlyEntrantStatus,
    allies: ReadonlyEntrantStatus[],
    visibleEnemies: ReadonlyEntrantStatus[],
    [heal, regen]: SpellStatus[]
  ): Action {
    if (helpers.canPerform(actions.cast(regen))) {
      return actions.cast(regen);
    }

    if (
      you.health.value / you.health.max < 0.5 &&
      helpers.canPerform(actions.cast(heal))
    ) {
      return actions.cast(heal);
    }

    return actions.move("left");
  }
}
