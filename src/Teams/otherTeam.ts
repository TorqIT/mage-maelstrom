import {
  AbilityType,
  Combatant,
  DamageType,
  SpellType,
  StatusEffectType,
  Team,
} from "../MageMaelstrom";
import { MovementDirection } from "../MageMaelstrom/Arena";
import { ActParams, CombatantDefinition } from "../MageMaelstrom";
import { Action } from "../MageMaelstrom/Combatant/actions";

class WowDude extends Combatant {
  private dirPriority: MovementDirection[] = ["left", "up", "right", "down"];
  private target = 0;

  public define(): CombatantDefinition {
    return {
      name: "Wow Dude",
      icon: "/burst.png",

      strength: 5,
      agility: 25,
      intelligence: 10,

      abilities: ["bear", "fear", "doubletap", "doubletap"],
    };
  }
  public init(): void {}
  public act({
    actions,
    helpers,
    visibleEnemies,
    spells: [bear, fear],
  }: ActParams): Action {
    if (helpers.canPerform(actions.cast(bear))) {
      return actions.cast(bear);
    }

    if (visibleEnemies.length > 0) {
      const snipableEnemy = visibleEnemies.find((s) =>
        helpers.canPerform(actions.cast(fear, s.id))
      );

      if (snipableEnemy) {
        return actions.cast(fear, snipableEnemy.id);
      }

      const attackableEnemy = visibleEnemies.find((s) =>
        helpers.canPerform(actions.attack(s.id))
      );

      if (attackableEnemy) {
        return actions.attack(attackableEnemy.id);
      }
    }

    helpers.safeWhile(
      () => !helpers.canPerform(actions.move(this.dirPriority[this.target])),
      () => {
        this.target = (this.target + 1) % 4;
      }
    );

    return actions.move(this.dirPriority[this.target]);
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

const otherTeam: Team = {
  name: "Very Cool Team",
  color: "#00c",
  CombatantSubclasses: [WowDude, WowDude],
};

export { otherTeam };
