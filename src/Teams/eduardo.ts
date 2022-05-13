import {
  Action,
  ActParams,
  Combatant,
  CombatantDefinition,
  Team,
} from "../MageMaelstrom";
import { BasicCoordinate } from "../MageMaelstrom/Arena";
import {
  InitParams,
  OnTakeDamageParams,
  OnStatusEffectAppliedParams,
} from "../MageMaelstrom/Combatant";
import { mmZap } from "../MageMaelstrom/Common/Icon";

class Seeker extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "Runner",
      icon: "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2F4.bp.blogspot.com%2F_lwmLZvKDhXQ%2FTMUicub-WMI%2FAAAAAAAAAFA%2F5XyrBR6WyZ4%2Fs1600%2Fcat%2Bwith%2Bbinoculars.jpg&f=1&nofb=1",
      strength: 15,
      agility: 20,
      intelligence: 5,
      abilities: ["vision", "darkness", "evasion", "thorns"], // spirits
    };
  }

  private arena: { width: number; height: number } = { width: 0, height: 0 };
  private isLeft: boolean = false;

  public init(params: InitParams): void {
    this.arena = params.arena;
    this.isLeft = params.isLeft;
  }

  public act(params: ActParams): Action {
    if (params.visibleEnemies.length === 0) {
      this.shout("Searching");
      return this.search(params);
    } else {
      var closest = params.helpers.getClosest(params.visibleEnemies);
      if (closest) {
        if (params.you.coords.getDistance(closest.coords) <= 3) {
          this.shout("Aiiieeeee");
          return params.actions.runFrom(closest) || this.search(params);
        }
        this.shout("I'ma coming for you");
        return params.actions.attackMove(closest) || this.search(params);
      } else {
        this.shout("Where enemy 2");
        return this.search(params);
      }
    }
  }

  private search(params: ActParams) {
    var action = params.actions.move(this.isLeft ? "right" : "left");
    var result = params.helpers.getActionResult(action);
    switch (result) {
      case "Success":
        return action;
      case "OutOfArena":
        this.isLeft = !this.isLeft;
        this.shout("Turing around");
        return params.actions.dance();
      case "TileOccupied":
        return params.actions.dance();
    }
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

class Sniper extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "Torq Trolls Sniper",
      icon: "https://i.ytimg.com/vi/WWZBoS83qCs/hqdefault.jpg",
      strength: 5,
      agility: 5,
      intelligence: 40,
      abilities: ["talented", "talented", "fireball", "teleport"],
    };
  }

  public init(params: InitParams): void {}

  public act({
    helpers,
    you,
    actions,
    visibleEnemies,
    spells: [fireball, teleport],
    tick,
  }: ActParams): Action {
    if (tick == 1) {
      // teleport to corner
      return actions.cast(teleport, { x: 0, y: 0 });
    }
    if (visibleEnemies.length > 0) {
      const enemy = helpers.getClosest(visibleEnemies);
      if (enemy && enemy.coords.getDistance(you.coords) <= 1) {
        return actions.cast(teleport, {
          x: Math.random() * 14,
          y: Math.random() * 10,
        });
      } else if (enemy && enemy.coords.getDistance(you.coords) <= 5) {
        this.shout(`Shooting ${enemy.id}`);
        return actions.cast(fireball, enemy.id);
      } else {
        this.shout("moving to enemy");
        return (enemy && actions.moveTo(enemy.coords)) || actions.dance();
      }
    }
    return actions.dance();
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

export const torqTrolls: Team = {
  name: "The Torq Trolls",
  color: "#000",
  author: "Take a Guess",
  CombatantSubclasses: [Seeker, Sniper],
};
function onTakeDamage(params: any, OnTakeDamageParams: any) {
  throw new Error("Function not implemented.");
}

function onStatusEffectApplied(params: any, OnStatusEffectAppliedParams: any) {
  throw new Error("Function not implemented.");
}
