import { ReadonlyEntrantStatus, SpellStatus, Action, actions } from "../..";
import { Helpers } from "../../../Logic";
import { Combatant, CombatantDefinition } from "../../combatant";
import bearIcon from "./bear.png";

export class BearCombatant extends Combatant {
  private targetX = 0;
  private targetY = 0;

  public define(): CombatantDefinition {
    return {
      name: "A Bear",
      icon: bearIcon,
      strength: 10,
      agility: 8,
      intelligence: 5,
      abilities: [],
    };
  }

  public init(): void {
    this.generateTarget();
  }

  public act(
    helpers: Helpers,
    you: ReadonlyEntrantStatus,
    allies: ReadonlyEntrantStatus[],
    visibleEnemies: ReadonlyEntrantStatus[],
    spells: SpellStatus[]
  ): Action {
    const action = this.tryEngageEnemy(helpers, you, visibleEnemies);

    if (action) {
      return action;
    }

    const moveAction = this.tryGetMovementAction(you, helpers);

    if (moveAction) {
      return moveAction;
    }

    return actions.dance();
  }

  private tryEngageEnemy(
    helpers: Helpers,
    you: ReadonlyEntrantStatus,
    visibleEnemies: ReadonlyEntrantStatus[]
  ) {
    for (const enemy of visibleEnemies) {
      if (helpers.canPerform(actions.attack(enemy.id))) {
        return actions.attack(enemy.id);
      } else if (helpers.coords.isWithinRange(enemy.coords, 3)) {
        return actions.moveTo(enemy.coords, you.coords);
      }
    }
  }

  private tryGetMovementAction(you: ReadonlyEntrantStatus, helpers: Helpers) {
    let checks = 0;

    while (checks < 100) {
      const action = actions.moveTo(
        { x: this.targetX, y: this.targetY },
        you.coords
      );

      if (action && helpers.canPerform(action)) {
        return action;
      } else {
        this.generateTarget();
      }

      checks++;
    }
  }

  private generateTarget() {
    this.targetX = Math.floor(Math.random() * this.getGameSpecs().arena.width);
    this.targetY = Math.floor(Math.random() * this.getGameSpecs().arena.height);
  }
}
