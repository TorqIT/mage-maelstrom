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

      strength: 30,
      agility: 5,
      intelligence: 5,

      abilities: ["heal", "regen", "force", "thorns"],
    };
  }
  public init(): void {}
  public act(
    helpers: Helpers,
    you: ReadonlyEntrantStatus,
    allies: ReadonlyEntrantStatus[],
    visibleEnemies: ReadonlyEntrantStatus[],
    [heal, regen, force]: SpellStatus[]
  ): Action {
    const closestEnemy = helpers.getClosest(visibleEnemies);

    if (
      closestEnemy &&
      helpers.canPerform(actions.cast(force, closestEnemy.id))
    ) {
      return actions.cast(force, closestEnemy.id);
    }

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
