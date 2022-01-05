import { Combatant } from "../MageMaelstrom";
import { ReadonlyCoordinate } from "../MageMaelstrom/Arena";
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

      abilities: ["potion", "teleport", "stun", "frost"],
    };
  }
  public init(): void {}
  public act({
    actions,
    helpers,
    you,
    visibleEnemies,
    spells: [potion, teleport, stun],
  }: ActParams): Action {
    const coord = this.getRandomCoord();
    if (helpers.canPerform(actions.cast(teleport, coord))) {
      return actions.cast(teleport, coord);
    }

    const closestEnemy = helpers.getClosest(visibleEnemies);

    if (
      closestEnemy &&
      helpers.canPerform(actions.cast(stun, closestEnemy.id))
    ) {
      return actions.cast(stun, closestEnemy.id);
    }

    if (
      you.health.value / you.health.max < 0.5 &&
      helpers.canPerform(actions.cast(potion))
    ) {
      return actions.cast(potion);
    }

    return actions.dance();
  }

  private getRandomCoord(): ReadonlyCoordinate {
    return {
      x: Math.floor(Math.random() * this.getGameSpecs().arena.width),
      y: Math.floor(Math.random() * this.getGameSpecs().arena.height),
    };
  }
}
