import { Combatant, Team } from "../MageMaelstrom";
import { MovementDirection } from "../MageMaelstrom/Arena";
import {
  ActParams,
  CombatantDefinition,
  SpellStatus,
} from "../MageMaelstrom/Combatant";
import { Action, ActionFactory } from "../MageMaelstrom/Combatant/actions";
import { Helpers } from "../MageMaelstrom/Logic";

class WowDude extends Combatant {
  private dirPriority: MovementDirection[] = ["left", "up", "right", "down"];
  private target = 0;

  public define(): CombatantDefinition {
    return {
      name: "Wow Dude",
      icon: "/burst.png",

      strength: 8,
      agility: 31,
      intelligence: 9,

      abilities: ["bear", "poison", "dash", "talented"],
    };
  }
  public init(): void {}
  public act({
    actions,
    helpers,
    visibleEnemies,
    spells: [bear, poison, dash],
  }: ActParams): Action {
    if (helpers.canPerform(actions.cast(bear))) {
      return actions.cast(bear);
    }

    if (visibleEnemies.length > 0) {
      const snipableEnemy = visibleEnemies.find((s) =>
        helpers.canPerform(actions.cast(poison, s.id))
      );

      if (snipableEnemy) {
        return actions.cast(poison, snipableEnemy.id);
      }

      const attackableEnemy = visibleEnemies.find((s) =>
        helpers.canPerform(actions.attack(s.id))
      );

      if (attackableEnemy) {
        return actions.attack(attackableEnemy.id);
      }
    }

    while (!helpers.canPerform(actions.move(this.dirPriority[this.target]))) {
      this.target = (this.target + 1) % 4;
    }

    if (helpers.canPerform(actions.cast(dash, this.dirPriority[this.target]))) {
      return actions.cast(dash, this.dirPriority[this.target]);
    }

    return actions.move(this.dirPriority[this.target]);
  }
}

const otherTeam: Team = {
  name: "Very Cool Team",
  color: "#00c",
  CombatantSubclasses: [WowDude, WowDude],
};

export { otherTeam };
