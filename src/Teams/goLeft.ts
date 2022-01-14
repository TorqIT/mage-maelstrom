import {
  AbilityType,
  Combatant,
  DamageType,
  SpellType,
  StatusEffectType,
} from "../MageMaelstrom";
import { ReadonlyCoordinate } from "../MageMaelstrom/Arena";
import { CombatantDefinition, Action, ActParams } from "../MageMaelstrom";

export class GoLeft extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "STAND",
      icon: "/burst.png",

      strength: 26,
      agility: 5,
      intelligence: 9,

      abilities: ["potion", "teleport", "burst", "thorns"],
    };
  }
  public init(): void {}
  public act({
    actions,
    helpers,
    you,
    visibleEnemies,
    spells: [potion, teleport, burst],
  }: ActParams): Action {
    const coord = this.getRandomCoord();
    if (helpers.canPerform(actions.cast(teleport, coord))) {
      return actions.cast(teleport, coord);
    }

    if (
      helpers.canPerform(actions.cast(burst)) &&
      visibleEnemies.some((e) => helpers.coords.isWithinRange(e.coords, 1.5))
    ) {
      return actions.cast(burst);
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

  public onTakeDamage(
    enemyId: number,
    damage: number,
    type: DamageType,
    ability?: AbilityType
  ): void {}
  public onNegativeStatusApplied(
    enemyId: number,
    status: StatusEffectType
  ): void {}
}
