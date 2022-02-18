import {
  Action,
  ActParams,
  Combatant,
  CombatantDefinition,
  Team,
} from "../MageMaelstrom";
import { MovementDirection } from "../MageMaelstrom/Arena";
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
    return this.wanderAimlessly(params) ?? params.actions.dance();
  }

  private wanderAimlessly({ actions, helpers }: ActParams) {
    const directions: MovementDirection[] = ["up", "down", "left", "right"];

    for (let j = 0; j < 10; j++) {
      const action = actions.move(directions[Math.floor(Math.random() * 4)]);

      if (helpers.canPerform(action)) {
        return action;
      }
    }
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

export const brutishBarbarians: Team = {
  name: "The Brutish Barbarians",
  color: "#000",
  CombatantSubclasses: [Brute, Brute],
};
