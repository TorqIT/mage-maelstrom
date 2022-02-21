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
    } else {
      if (this.hasBear(params)) {
        if (this.isFarFromBear(params)) {
          return this.followBear(params) ?? params.actions.dance();
        }
      }
    }

    return this.wanderAround(params) ?? params.actions.dance();
  }

  private canSummon({ actions, helpers, spells: [bear] }: ActParams) {
    return helpers.canPerform(actions.cast(bear));
  }

  private summonBear({ actions, spells: [bear] }: ActParams) {
    return actions.cast(bear);
  }

  private hasBear({ allies }: ActParams) {
    return allies.some((a) => !a.essential);
  }

  private isFarFromBear({ allies, helpers, you }: ActParams) {
    const closestBear = helpers.getClosest(allies.filter((a) => !a.essential))!;
    return closestBear.coords.getDistance(you.coords) > 4;
  }

  private followBear({ actions, helpers, allies }: ActParams) {
    const closestBear = helpers.getClosest(allies.filter((a) => !a.essential))!;
    return actions.moveTo(closestBear);
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
