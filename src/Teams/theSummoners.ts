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

class Summoner extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "Summoner",
      icon: "/pentagram-rose.svg",
      strength: 12,
      agility: 10,
      intelligence: 18,
      abilities: ["bear", "poison", "mind", "evasion"],
    };
  }

  public init(params: InitParams): void {}

  public act(params: ActParams): Action {
    if (this.canSummon(params)) {
      return this.summonBear(params);
    }

    return this.wanderAround(params) ?? params.actions.dance();
  }

  private canSummon({ actions, helpers, spells: [bear] }: ActParams) {
    return helpers.canPerform(actions.cast(bear));
  }

  private summonBear({ actions, spells: [bear] }: ActParams) {
    return actions.cast(bear);
  }

  private wanderAround({ actions, helpers }: ActParams) {
    for (let j = 0; j < 10; j++) {
      const dir: MovementDirection = (
        ["left", "right", "up", "down"] as MovementDirection[]
      )[Math.floor(Math.random() * 4)];

      if (helpers.canPerform(actions.move(dir))) {
        return actions.move(dir);
      }
    }
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

export const summoners: Team = {
  name: "The Summoners",
  color: "#FA2",
  CombatantSubclasses: [Summoner, Summoner],
};
