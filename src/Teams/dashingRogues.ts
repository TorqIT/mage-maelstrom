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
      strength: 5,
      agility: 30,
      intelligence: 5,
      abilities: ["dash", "swift", "serrated", "vision"],
      handicap: true,
    };
  }

  public init(params: InitParams): void {
    this.arena = params.arena;
    this.buildHuntTarget(!params.isLeft);
  }

  public act(params: ActParams): Action {
    return (
      this.getFirstValidAction([
        () => this.goAllOut(params),
        () => this.beDashing(params),
        () => this.hunt(params),
      ]) ?? params.actions.dance()
    );
  }

  private getFirstValidAction(actions: (() => Action | undefined)[]) {
    for (const act of actions) {
      const result = act();

      if (result) {
        return result;
      }
    }
  }

  private hunt({ actions, helpers }: ActParams) {
    for (let j = 0; j < 10; j++) {
      const result = actions.moveTo(this.huntTarget);
      if (result && helpers.canPerform(result)) {
        return result;
      }

      this.buildHuntTarget(Math.random() > 0.5);
    }
  }

  private buildHuntTarget(targetRight: boolean) {
    this.huntTarget = new ReadonlyCoordinate({
      x: targetRight ? this.arena.width - 2 : 2,
      y: Math.random() > 0.5 ? this.arena.height - 2 : 2,
    });
  }

  private beDashing({
    visibleEnemies,
    you,
    actions,
    helpers,
    spells: [dash],
  }: ActParams) {
    const closestEnemy = helpers.getClosest(visibleEnemies);

    if (closestEnemy) {
      if (
        !closestEnemy.coords.isWithinRangeOf(3, you.coords) &&
        closestEnemy.coords.isWithinRangeOf(5, you.coords)
      ) {
        const dir = you.coords.getRelativeDirectionOf(closestEnemy.coords);
        const dashAction = actions.cast(dash, dir);

        if (helpers.canPerform(dashAction)) {
          return dashAction;
        }
      }

      return actions.moveTo(closestEnemy);
    }

    return undefined;
  }

  private goAllOut({
    helpers,
    visibleEnemies,
    spells: [, swift],
    actions,
  }: ActParams) {
    const closestEnemy = helpers.getClosest(visibleEnemies);

    if (closestEnemy) {
      const swiftAction = actions.cast(swift, closestEnemy.id);

      if (helpers.canPerform(swiftAction)) {
        return swiftAction;
      }

      const attackAction = actions.attack(closestEnemy.id);

      if (helpers.canPerform(attackAction)) {
        return attackAction;
      }
    }
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

export const dashingRogues: Team = {
  name: "Dashing Rogues",
  color: "#294",
  CombatantSubclasses: [Dashing, Dashing],
};
