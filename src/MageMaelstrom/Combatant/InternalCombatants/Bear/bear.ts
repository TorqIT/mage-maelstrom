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
    console.log("An action!", "X:", this.targetX, "Y:", this.targetY);

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

    return actions.dance();
  }

  private generateTarget() {
    this.targetX = Math.floor(Math.random() * this.getArenaWidth());
    this.targetY = Math.floor(Math.random() * this.getArenaHeight());
  }
}
