import { Combatant, Team } from "../MageMaelstrom";
import { MovementDirection } from "../MageMaelstrom/Arena";
import {
  AbilityType,
  CombatantDefinition,
  ReadonlyEntrantStatus,
  SpellStatus,
  SpellType,
} from "../MageMaelstrom/Combatant";
import { Action, actions } from "../MageMaelstrom/Combatant/actions";
import { Helpers } from "../MageMaelstrom/Logic";

class WowDude extends Combatant {
  private dirPriority: MovementDirection[] = ["left", "up", "right", "down"];
  private target = 0;

  public define(): CombatantDefinition {
    return {
      name: "Wow Dude",
      icon: "/burst.png",

      strength: 5,
      agility: 25,
      intelligence: 5,

      abilities: ["bear", "critical", "critical", "critical"],
    };
  }
  public init(): void {}
  public act(
    helpers: Helpers,
    you: ReadonlyEntrantStatus,
    allies: ReadonlyEntrantStatus[],
    visibleEnemies: ReadonlyEntrantStatus[],
    [bear]: SpellStatus[]
  ): Action {
    if (helpers.canPerform(actions.cast(bear))) {
      return actions.cast(bear);
    }

    if (visibleEnemies.length > 0) {
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

    return actions.move(this.dirPriority[this.target]);
  }

  private tryCast(helpers: Helpers, spell: SpellStatus, enemyId: number) {
    const spellAction = actions.cast(spell, enemyId);

    if (helpers.canPerform(spellAction)) {
      return spellAction;
    }
  }
}

const otherTeam: Team = {
  name: "Very Cool Team",
  color: "#00c",
  CombatantSubclasses: [WowDude, WowDude],
};

export { otherTeam };
