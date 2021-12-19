import { ReadonlyEntrantStatus, SpellStatus, Action, actions } from "../..";
import { Helpers } from "../../../Logic";
import { Combatant, CombatantDefinition } from "../../combatant";
import bearIcon from "./bear.png";

export class BearCombatant extends Combatant {
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

  public init(): void {}

  public act(
    helpers: Helpers,
    visibleEnemies: ReadonlyEntrantStatus[],
    spells: SpellStatus[]
  ): Action {
    return actions.move("left");
  }
}
