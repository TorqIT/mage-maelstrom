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

class Guts extends Combatant {
  private isLeft: boolean = false;

  public define(): CombatantDefinition {
    return {
      name: "Guts",
      icon: "https://www.pngfind.com/pngs/m/218-2188202_guts-picture-background-image-berserk-guts-png-transparent.png",
      strength: 40,
      agility: 5,
      intelligence: 5,
      abilities: ["talented", "talented", "critical", "critical"],
    };
  }

  public init(params: InitParams): void {
    this.isLeft = params.isLeft;
  }

  public act(params: ActParams): Action {
    if (params.visibleEnemies.length) {
      var closest = params.helpers.getClosest(params.visibleEnemies);
      if (closest) {
        if (params.you.coords.getDistance(closest.coords) === 1) {
          this.shout("BIG SWORD GO BRRRR");
          return params.actions.attack(closest.id);
        }
        var attackMove = params.actions.attackMove(closest);
        if (attackMove) {
          this.shout("big sword go vroom");
          return attackMove;
        }

        this.shout("Where enemy");

        return this.search(params);
      } else {
        this.shout("Where enemy 2");
        return this.search(params);
      }
    }

    this.shout("Where enemy 3");
    return this.search(params);

    return params.actions.dance();
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

class Runner extends Combatant {
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

class Gunner extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "Fivebro",
      icon: "/default.svg",
      strength: 50,
      agility: 5,
      intelligence: 5,
      abilities: ["talented", "talented", "talented", "talented"],
    };
  }

  public init(params: InitParams): void {}

  public act(params: ActParams): Action {
    if (params.visibleEnemies.length) {
      var closest = params.helpers.getClosest(params.visibleEnemies);
      if (closest) {
        if (params.you.coords.getDistance(closest.coords) === 0) {
          this.shout("BIG SWORD GO BRRRR");
          return params.actions.attack(closest.id);
        }
        var attackMove = params.actions.attackMove(closest);
        if (attackMove) {
          this.shout("big sword go vroom");
          return attackMove;
        }

        this.shout("Where enemy");
        return params.actions.move("right");
      } else {
        this.shout("Where enemy 2");
        return params.actions.move("right");
      }
    }

    this.shout("Where enemy 3");
    return params.actions.move("right");

    return params.actions.dance();
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

export const GutsTeam: Team = {
  name: "Guts",
  color: "#F00",
  author: "Sean",
  CombatantSubclasses: [Guts, Guts],
};
