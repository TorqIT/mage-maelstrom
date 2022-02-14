import { Combatant, Team } from "../MageMaelstrom";
import { MovementDirection } from "../MageMaelstrom/Arena";
import { ActParams, CombatantDefinition } from "../MageMaelstrom";
import { Action } from "../MageMaelstrom/Combatant/actions";
import {
  OnStatusEffectAppliedParams,
  OnTakeDamageParams,
} from "../MageMaelstrom/Combatant";

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

      abilities: ["bear", "zap", "doubletap", "doubletap"],
    };
  }
  public init(): void {}
  public act({
    actions,
    helpers,
    visibleEnemies,
    spells: [bear, zap],
  }: ActParams): Action {
    if (helpers.canPerform(actions.cast(bear))) {
      return actions.cast(bear);
    }

    if (visibleEnemies.length > 0) {
      const snipableEnemy = visibleEnemies.find((s) =>
        helpers.canPerform(actions.cast(zap, s.id))
      );

      if (snipableEnemy) {
        return actions.cast(zap, snipableEnemy.id);
      }

      const attackableEnemy = visibleEnemies.find((s) =>
        helpers.canPerform(actions.attack(s.id))
      );

      if (attackableEnemy) {
        return actions.attack(attackableEnemy.id);
      }
    }

    for (
      let j = 0;
      j < 4 && !helpers.canPerform(actions.move(this.dirPriority[this.target]));
      j++
    ) {
      this.target = (this.target + 1) % 4;
    }

    return actions.move(this.dirPriority[this.target]);
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}
  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

const otherTeam: Team = {
  name: "Very Cool Team",
  color: "#00c",
  CombatantSubclasses: [WowDude, WowDude],
};

export { otherTeam };
