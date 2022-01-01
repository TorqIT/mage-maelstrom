import { Combatant, Team } from "../MageMaelstrom";
import { MovementDirection } from "../MageMaelstrom/Arena";
import { ActParams, CombatantDefinition } from "../MageMaelstrom/Combatant";
import { Action } from "../MageMaelstrom/Combatant/actions";

class WowDude extends Combatant {
  private dirPriority: MovementDirection[] = ["left", "up", "right", "down"];
  private target = 0;

  public define(): CombatantDefinition {
    return {
      name: "Wow Dude",
      icon: "/burst.png",

      strength: 10,
      agility: 10,
      intelligence: 20,

      abilities: ["bear", "poison", "meteor", "doubletap"],
    };
  }
  public init(): void {}
  public act({
    actions,
    helpers,
    visibleEnemies,
    spells: [bear, poison, meteor],
  }: ActParams): Action {
    if (helpers.canPerform(actions.cast(bear))) {
      return actions.cast(bear);
    }

    if (visibleEnemies.length > 0) {
      if (helpers.canPerform(actions.cast(meteor, visibleEnemies[0].coords))) {
        return actions.cast(meteor, visibleEnemies[0].coords);
      }

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

    helpers.safeWhile(
      () => !helpers.canPerform(actions.move(this.dirPriority[this.target])),
      () => {
        this.target = (this.target + 1) % 4;
      }
    );

    return actions.move(this.dirPriority[this.target]);
  }
}

const otherTeam: Team = {
  name: "Very Cool Team",
  color: "#00c",
  CombatantSubclasses: [WowDude, WowDude],
};

export { otherTeam };
