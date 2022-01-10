import { ReadonlyEntrantStatus, Action } from "../..";
import { mmBear } from "../../../Common/Icon";
import { Helpers } from "../../../Logic";
import { ActionFactory } from "../../actions";
import { ActParams, Combatant, CombatantDefinition } from "../../combatant";

export class BearCombatant extends Combatant {
  private targetX = 0;
  private targetY = 0;

  public define(): CombatantDefinition {
    return {
      name: "A Bear",
      icon: mmBear.file,
      strength: 10,
      agility: 8,
      intelligence: 5,
      abilities: [],
    };
  }

  public init(): void {
    this.generateTarget();
  }

  public act({ actions, helpers, you, visibleEnemies }: ActParams): Action {
    const action = this.tryEngageEnemy(actions, helpers, visibleEnemies);

    if (action) {
      return action;
    }

    const moveAction = this.tryGetMovementAction(actions, helpers);

    if (moveAction) {
      return moveAction;
    }

    return actions.dance();
  }

  private tryEngageEnemy(
    actions: ActionFactory,
    helpers: Helpers,
    visibleEnemies: ReadonlyEntrantStatus[]
  ) {
    for (const enemy of visibleEnemies) {
      if (helpers.canPerform(actions.attack(enemy.id))) {
        return actions.attack(enemy.id);
      } else if (helpers.coords.isWithinRange(enemy.coords, 3)) {
        return actions.moveTo(enemy.coords);
      }
    }
  }

  private tryGetMovementAction(actions: ActionFactory, helpers: Helpers) {
    let checks = 0;

    while (checks < 100) {
      const action = actions.moveTo({ x: this.targetX, y: this.targetY });

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
