import { Combatant } from "../MageMaelstrom";
import {
  CombatantDefinition,
  Action,
  ActParams,
} from "../MageMaelstrom/Combatant";
import { Helpers } from "../MageMaelstrom/Logic";

export class GoLeft extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "STAND",
      icon: "/burst.png",

      strength: 26,
      agility: 5,
      intelligence: 9,

      abilities: ["heal", "regen", "force", "thorns"],
    };
  }
  public init(): void {}
  public act({
    actions,
    helpers,
    you,
    visibleEnemies,
    spells: [heal, regen, force],
  }: ActParams): Action {
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

    return actions.dance();
  }
}
