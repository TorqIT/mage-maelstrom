import arrayShuffle from "array-shuffle";
import { coordsEqual, isNextTo, moveCoordinate } from "../Arena";
import {
  Action,
  ActionType,
  ActiveTeam,
  AttackAction,
  CombatantSubclass,
  Entrant,
  IdentifiedTeam,
  MovementAction,
  ReadonlyActiveTeam,
  ReadonlyEntrant,
} from "../Combatant";
import { ActionResult } from "./actionResult";
import { GameSpecs } from "./gameSpecs";
import { buildHelpers } from "./helpers";

export class GameManager {
  private specs: GameSpecs;

  private leftTeam?: ActiveTeam;
  private rightTeam?: ActiveTeam;

  private idTracker = 0;

  private currentTick = 0;

  public constructor(specs: GameSpecs) {
    this.specs = specs;
  }

  public buildCombatant(SubCombatant: CombatantSubclass) {
    return new SubCombatant(this.specs);
  }

  public startGame(left: IdentifiedTeam, right: IdentifiedTeam) {
    this.currentTick = -1;

    this.leftTeam = this.buildActiveTeam(left, false);
    this.rightTeam = this.buildActiveTeam(right, true);
  }

  private buildActiveTeam(team: IdentifiedTeam, isRight: boolean): ActiveTeam {
    return {
      id: team.id,
      name: team.name,
      color: team.color,
      flip: isRight,
      entrants: team.CombatantSubclasses.map((c) => this.toEntrant(c)),
    };
  }

  private toEntrant(SubCombatant: CombatantSubclass): Entrant {
    const combatant = new SubCombatant(this.specs);

    return {
      combatant,
      status: {
        id: this.idTracker++,
        health: {
          value: combatant.getMaxHealth(),
          max: combatant.getMaxHealth(),
        },
        mana: {
          value: combatant.getMaxMana(),
          max: combatant.getMaxMana(),
        },
        coords: {
          x: Math.floor(Math.random() * this.specs.arena.width),
          y: Math.floor(Math.random() * this.specs.arena.height),
        },
        nextTurn: Math.floor(Math.random() * combatant.getTurnDelay()),
      },
    };
  }

  public getLeftTeam() {
    return this.leftTeam ? this.toReadOnly(this.leftTeam) : undefined;
  }

  public getRightTeam() {
    return this.rightTeam ? this.toReadOnly(this.rightTeam) : undefined;
  }

  private toReadOnly(team: ActiveTeam): ReadonlyActiveTeam {
    return {
      ...team,
      entrants: team.entrants.map((e) => this.toReadOnlyEntrant(e)),
    };
  }

  private toReadOnlyEntrant(entrant: Entrant): ReadonlyEntrant {
    return {
      combatant: entrant.combatant.getDef(),
      status: entrant.status,
    };
  }

  public getCurrentTick() {
    return this.currentTick;
  }

  public tickUntilNextAction() {
    let tickCounter = 0;

    while (tickCounter < 500) {
      if (this.tick()) {
        return;
      }
    }
  }

  public tick() {
    if (!this.leftTeam || !this.rightTeam) {
      return;
    }

    this.currentTick++;

    const actionsToPerform = this.leftTeam.entrants
      .filter((e) => e.status.nextTurn === this.currentTick)
      .map((e) => ({
        entrant: e,
        action: e.combatant.act(
          buildHelpers((a: Action) => this.getActionResult(e, a)),
          this.rightTeam?.entrants.map((e) => e.status) ?? []
        ),
      }))
      .concat(
        this.rightTeam.entrants
          .filter((e) => e.status.nextTurn === this.currentTick)
          .map((e) => ({
            entrant: e,
            action: e.combatant.act(
              buildHelpers((a: Action) => this.getActionResult(e, a)),
              this.leftTeam?.entrants.map((e) => e.status) ?? []
            ),
          }))
      );

    const results = arrayShuffle(actionsToPerform).map((a) =>
      this.tryPerformAction(a.entrant, a.action)
    );

    return results.some((r) => r);
  }

  private tryPerformAction(entrant: Entrant, action: Action) {
    entrant.status.nextTurn += entrant.combatant.getTurnDelay();

    if (this.getActionResult(entrant, action) === ActionResult.Success) {
      this.performAction(entrant, action);

      return true;
    }

    return false;
  }

  private getActionResult(entrant: Entrant, action: Action): ActionResult {
    switch (action.type) {
      case ActionType.Movement:
        return this.canPerformMovementAction(entrant, action);
      case ActionType.Attack:
        return this.canPerformAttackAction(entrant, action);
    }

    return ActionResult.UnknownAction;
  }

  private canPerformMovementAction(entrant: Entrant, action: MovementAction) {
    const result = moveCoordinate(entrant.status.coords, action.direction);

    if (
      result.x < 0 ||
      result.x >= this.specs.arena.width ||
      result.y < 0 ||
      result.y >= this.specs.arena.height
    ) {
      return ActionResult.OutOfArena;
    }

    if (
      this.getEntrantArray()
        .filter((e) => e.status.id !== entrant.status.id)
        .some((e) => coordsEqual(e.status.coords, result))
    ) {
      return ActionResult.TileOccupied;
    }

    return ActionResult.Success;
  }

  private canPerformAttackAction(entrant: Entrant, action: AttackAction) {
    if (typeof action.target === "string") {
      return ActionResult.Success;
    }

    const targetEntrant = this.getEntrantArray().find(
      (e) => e.status.id === action.target
    );

    if (!targetEntrant) {
      return ActionResult.CombatantNotFound;
    }
    return isNextTo(entrant.status.coords, targetEntrant.status.coords)
      ? ActionResult.Success
      : ActionResult.OutOfRange;
  }

  private performAction(entrant: Entrant, action: Action) {
    switch (action.type) {
      case ActionType.Movement:
        this.move(entrant, action);
        break;
      case ActionType.Attack:
        this.attack(entrant, action);
        break;
    }
  }

  private move(entrant: Entrant, action: MovementAction) {
    entrant.status.coords = moveCoordinate(
      entrant.status.coords,
      action.direction
    );
  }

  private attack(entrant: Entrant, action: AttackAction) {
    let targetEntrant: Entrant | undefined;

    if (typeof action.target === "string") {
      const targetCoord = moveCoordinate(entrant.status.coords, action.target);
      targetEntrant = this.getEntrantArray().find((e) =>
        coordsEqual(e.status.coords, targetCoord)
      );
    } else {
      targetEntrant = this.getEntrantArray().find(
        (e) => e.status.id === action.target
      );
    }

    if (targetEntrant) {
      targetEntrant.status.health.value -= entrant.combatant.getDamage();
    }
  }

  private getEntrantArray() {
    if (!this.leftTeam || !this.rightTeam) {
      return [];
    }

    return this.leftTeam.entrants.concat(this.rightTeam.entrants);
  }
}
