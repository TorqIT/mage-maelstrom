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
    if (this.enemyIsVisible(params)) {
      if (this.canBashHead(params)) {
        return this.bashHead(params);
      } else {
        if (this.canClonk(params)) {
          return this.clonk(params);
        } else {
          return this.comeRunning(params);
        }
      }
    }

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

  private enemyIsVisible({ visibleEnemies }: ActParams) {
    return visibleEnemies.length > 0;
  }

  private comeRunning({ visibleEnemies, actions, helpers }: ActParams) {
    const closest = helpers.getClosest(visibleEnemies)!;

    return actions.moveTo(closest) ?? actions.dance();
  }

  private canBashHead({
    actions,
    visibleEnemies,
    helpers,
    spells: [stun],
  }: ActParams) {
    const closest = helpers.getClosest(visibleEnemies)!;

    if (
      !closest.statusesEffects.includes("stun") &&
      helpers.canPerform(actions.cast(stun, closest.id))
    ) {
      return true;
    }
  }

  private bashHead({
    actions,
    visibleEnemies,
    helpers,
    spells: [stun],
  }: ActParams) {
    const closest = helpers.getClosest(visibleEnemies)!;
    return actions.cast(stun, closest.id);
  }

  private canClonk({ actions, helpers, visibleEnemies }: ActParams) {
    const closest = helpers.getClosest(visibleEnemies)!;
    return helpers.canPerform(actions.attack(closest.id));
  }

  private clonk({ visibleEnemies, helpers, actions }: ActParams) {
    const closest = helpers.getClosest(visibleEnemies)!;
    return actions.attack(closest.id);
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

export const brutishBarbarians: Team = {
  name: "The Brutish Barbarians",
  color: "#000",
  CombatantSubclasses: [Brute, Brute],
};
