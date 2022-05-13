import { queryHelpers } from "@testing-library/react";
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

class SentryBearsCombatant extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "Steve French",
      icon: "/default.svg",
      strength: 25,
      agility: 10,
      intelligence: 5,
      abilities: ["swift", "critical", "serrated", "thorns"],
    };
  }

  public init(params: InitParams): void {}

  public act({
    actions,
    allies,
    you,
    spells: [swift],
    visibleEnemies,
    helpers,
  }: ActParams): Action {
    if (allies[0]) {
      if (allies[0].coords.getDistance(you.coords) > 1) {
        var action = actions.moveTo(allies[0].coords);
        if (action) {
          return action;
        }
      }
    }
    if (visibleEnemies.find((e) => e.coords.isNextTo(you.coords))) {
      var closestEnemy = visibleEnemies.find((e) => e.coords.getClosest);
      if (closestEnemy) {
        if (helpers.canPerform(actions.cast(swift, closestEnemy.id))) {
          actions.cast(swift, closestEnemy.id);
        } else {
          var action = actions.moveTo(closestEnemy.coords);
          if (action) {
            return action;
          }
        }
      }
    }
    if (
      visibleEnemies.find((e) => Math.abs(e.attackRange - you.attackRange) > 1)
    ) {
      var closestEnemy = visibleEnemies.find((e) => e.coords.getClosest);
      if (closestEnemy) {
        if (helpers.canPerform(actions.cast(swift, closestEnemy.id))) {
          actions.cast(swift, closestEnemy.id);
        } else {
          if (closestEnemy) {
            return actions.attack(closestEnemy.id);
          }
        }
      }
    }

    return actions.dance();
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

class HealerCombatant extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "Goat",
      icon: "/default.svg",
      strength: 5,
      agility: 10,
      intelligence: 25,
      abilities: ["heal", "mind", "barrier", "thorns"],
    };
  }

  public init(params: InitParams): void {}

  public act({
    actions,
    allies,
    you,
    spells: [heal, barrier],
    visibleEnemies,
  }: ActParams): Action {
    if (visibleEnemies.find((e) => e.coords.isNextTo(you.coords))) {
      var closestEnemy = visibleEnemies.find((e) => e.coords.getClosest);
      if (closestEnemy) {
        return actions.attack(closestEnemy.id);
      }
    } else if (allies[0]) {
      if (allies[0].coords.getDistance(you.coords) > 1) {
        var action = actions.moveTo(allies[0].coords);
        if (action) {
          return action;
        }
      }
    }
    if (allies[0].health) {
      if (allies[0].health.value / allies[0].health.max < 0.5) {
        if (allies[0].health.value < you.health.value) {
          console.log("heal ally");
          return actions.cast(heal, allies[0].id);
        } else {
          return actions.cast(heal, you.id);
        }
      } else if (allies[0].health.value / allies[0].health.max < 0.3) {
        if (allies[0].health.value < you.health.value) {
          return actions.cast(barrier, allies[0].id);
        } else {
          return actions.cast(barrier, you.id);
        }
      }
    } else {
      if (you.health.value / you.health.max < 0.5) {
        return actions.cast(heal, you.id);
      }
    }

    return actions.dance();
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

export const sentryBears: Team = {
  name: "SentryBears",
  color: "#456",
  author: "Reilly",
  CombatantSubclasses: [SentryBearsCombatant, HealerCombatant],
};
