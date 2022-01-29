import {
  AbilityType,
  Combatant,
  DamageType,
  SpellType,
  StatusEffectType,
} from "../MageMaelstrom";
import { BasicCoordinate } from "../MageMaelstrom/Arena";
import { CombatantDefinition, Action, ActParams } from "../MageMaelstrom";
import {
  InitParams,
  OnStatusEffectAppliedParams,
  OnTakeDamageParams,
} from "../MageMaelstrom/Combatant";

export class GoLeft extends Combatant {
  private arena: { width: number; height: number };

  public constructor() {
    super();
    this.arena = { width: 0, height: 0 };
  }

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

  public init(params: InitParams): void {}

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

  public onTakeDamage(params: OnTakeDamageParams): void {}
  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}
