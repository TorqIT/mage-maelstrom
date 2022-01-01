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

      abilities: ["potion", "barrier", "stun", "teleportitis"],
    };
  }
  public init(): void {}
  public act({
    actions,
    helpers,
    you,
    visibleEnemies,
    spells: [potion, barrier, stun],
  }: ActParams): Action {
    const closestEnemy = helpers.getClosest(visibleEnemies);

    if (
      closestEnemy &&
      helpers.canPerform(actions.cast(stun, closestEnemy.id))
    ) {
      return actions.cast(stun, closestEnemy.id);
    }

    if (helpers.canPerform(actions.cast(barrier))) {
      return actions.cast(barrier);
    }

    if (
      you.health.value / you.health.max < 0.5 &&
      helpers.canPerform(actions.cast(potion))
    ) {
      return actions.cast(potion);
    }

    return actions.dance();
  }
}
