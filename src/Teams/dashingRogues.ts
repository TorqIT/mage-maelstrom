import {
  Action,
  ActParams,
  Combatant,
  CombatantDefinition,
  Team,
} from "../MageMaelstrom";
import { ReadonlyCoordinate } from "../MageMaelstrom/Arena";
import {
  InitParams,
  OnTakeDamageParams,
  OnStatusEffectAppliedParams,
} from "../MageMaelstrom/Combatant";

class Dashing extends Combatant {
  private arena = { width: 0, height: 0 };
  private huntTarget = new ReadonlyCoordinate();

  public define(): CombatantDefinition {
    return {
      name: "Dashing Rogue",
      icon: "/rogue.svg",
      strength: 8,
      agility: 27,
      intelligence: 5,
      abilities: ["dash", "swift", "serrated", "critical"],
    };
  }

  public init(params: InitParams): void {
    this.arena = params.arena;
    this.buildHuntTarget(!params.isLeft);
  }

  public act(params: ActParams): Action {
    return [this.hunt(params)].find((a) => a != null) ?? params.actions.dance();
  }

  private hunt({ actions, helpers }: ActParams) {
    return helpers.safeWhile(
      () => true,
      () => {
        const result = actions.moveTo(this.huntTarget);
        if (result && helpers.canPerform(result)) {
          return result;
        }

        this.buildHuntTarget(Math.random() > 0.5);
        console.log("I AM HUNTING TO", this.huntTarget.toString());
      }
    );
  }

  private buildHuntTarget(targetRight: boolean) {
    this.huntTarget = new ReadonlyCoordinate({
      x: targetRight ? this.arena.width - 2 : 2,
      y: Math.random() > 0.5 ? this.arena.height - 2 : 2,
    });
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

export const dashingRogues: Team = {
  name: "Dashing Rogues",
  color: "#2A4",
  CombatantSubclasses: [Dashing, Dashing],
};
