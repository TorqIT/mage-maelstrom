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

class Brute extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "Brute",
      icon: "/ogre.svg",
      strength: 37,
      agility: 5,
      intelligence: 5,
      abilities: ["stun", "burst", "talented", "thorns"],
    };
  }

  public init(params: InitParams): void {}

  public act(params: ActParams): Action {
    return params.actions.dance();
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

export const brutishBarbarians: Team = {
  name: "The Brutish Barbarians",
  color: "#000",
  CombatantSubclasses: [Brute, Brute],
};
