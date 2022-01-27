import {
  AbilityType,
  Combatant,
  DamageType,
  SpellType,
  StatusEffectType,
} from "../MageMaelstrom";
import { BasicCoordinate } from "../MageMaelstrom/Arena";
import { CombatantDefinition, Action, ActParams } from "../MageMaelstrom";

export class GoLeft extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "STAND",
      icon: "/burst.png",

      strength: 26,
      agility: 5,
      intelligence: 9,

      abilities: ["potion", "heal", "burst", "evasion"],
    };
  }
  public init(): void {}
  public act({
    actions,
    helpers,
    you,
    visibleEnemies,
    spells: [potion, heal, burst],
  }: ActParams): Action {
    if (helpers.canPerform(actions.cast(heal))) {
      return actions.cast(heal);
    }

    if (
      helpers.canPerform(actions.cast(burst)) &&
      visibleEnemies.some((e) => you.coords.isWithinRangeOf(1.5, e.coords))
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

  private getRandomCoord(): BasicCoordinate {
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
