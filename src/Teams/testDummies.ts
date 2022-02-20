import {
  Action,
  ActParams,
  Combatant,
  CombatantDefinition,
  Team,
} from "../MageMaelstrom";
import {
  InitParams,
  OnTakeDamageParams,
  OnStatusEffectAppliedParams,
} from "../MageMaelstrom/Combatant";
import { mmZap } from "../MageMaelstrom/Common/Icon";

class TestDummy extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "Test Dummy",
      icon: "/trainingDummy.svg",
      strength: 50,
      agility: 5,
      intelligence: 5,
      abilities: ["talented", "talented", "talented", "talented"],
    };
  }

  public init(params: InitParams): void {}

  public act(params: ActParams): Action {
    return params.actions.dance();
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

export const testDummies: Team = {
  name: "The Test Dummies",
  color: "#000",
  CombatantSubclasses: [TestDummy, TestDummy],
};
