import arrayShuffle from "array-shuffle";
import { coordsEqual, isNextTo, moveCoordinate } from "../Arena";
import {
  Action,
  ActionType,
  ActiveTeam,
  AttackAction,
  Entrant,
  getPrimaryStat,
  IdentifiedCombatant,
  IdentifiedTeam,
  MovementAction,
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
      entrants: team.combatants.map((c) => this.toEntrant(c, team)),
    };
  }

  private toEntrant(
    combatant: IdentifiedCombatant<object>,
    team: IdentifiedTeam
  ): Entrant<object> {
    return {
      combatant,
      team,
      memory: combatant.init(),
      status: {
        id: this.idTracker++,
        health: {
          value: combatant.strength * this.specs.stats.healthPerStrength,
          max: combatant.strength * this.specs.stats.healthPerStrength,
        },
        mana: {
          value: combatant.intelligence * this.specs.stats.manaPerInt,
          max: combatant.intelligence * this.specs.stats.manaPerInt,
        },
        coords: {
          x: Math.floor(Math.random() * this.specs.arena.width),
          y: Math.floor(Math.random() * this.specs.arena.height),
        },
        nextTurn: Math.floor(
          Math.random() *
            (100 / Math.pow(this.specs.stats.agilityBonus, combatant.agility))
        ),
      },
    };
  }

  private getNextTurn(agility: number) {
    return Math.floor(
      this.currentTick + 100 / Math.pow(this.specs.stats.agilityBonus, agility)
    );
  }

  public getLeftTeam() {
    return this.leftTeam;
  }

  public getRightTeam() {
    return this.rightTeam;
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
          this.rightTeam?.entrants.map((e) => e.status) ?? [],
          e.memory
        ),
      }))
      .concat(
        this.rightTeam.entrants
          .filter((e) => e.status.nextTurn === this.currentTick)
          .map((e) => ({
            entrant: e,
            action: e.combatant.act(
              buildHelpers((a: Action) => this.getActionResult(e, a)),
              this.leftTeam?.entrants.map((e) => e.status) ?? [],
              e.memory
            ),
          }))
      );

    const results = arrayShuffle(actionsToPerform).map((a) =>
      this.tryPerformAction(a.entrant, a.action)
    );

    return results.some((r) => r);
  }

  private tryPerformAction(entrant: Entrant<object>, action: Action) {
    entrant.status.nextTurn = this.getNextTurn(entrant.combatant.agility);

    if (this.getActionResult(entrant, action) === ActionResult.Success) {
      this.performAction(entrant, action);

      return true;
    }

    return false;
  }

  private getActionResult(
    entrant: Entrant<object>,
    action: Action
  ): ActionResult {
    switch (action.type) {
      case ActionType.Movement:
        return this.canPerformMovementAction(entrant, action);
      case ActionType.Attack:
        return this.canPerformAttackAction(entrant, action);
    }

    return ActionResult.UnknownAction;
  }

  private canPerformMovementAction(
    entrant: Entrant<object>,
    action: MovementAction
  ) {
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

  private canPerformAttackAction(
    entrant: Entrant<object>,
    action: AttackAction
  ) {
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

  private performAction(entrant: Entrant<object>, action: Action) {
    switch (action.type) {
      case ActionType.Movement:
        this.move(entrant, action);
        break;
      case ActionType.Attack:
        this.attack(entrant, action);
        break;
    }
  }

  private move(entrant: Entrant<object>, action: MovementAction) {
    entrant.status.coords = moveCoordinate(
      entrant.status.coords,
      action.direction
    );
  }

  private attack(entrant: Entrant<object>, action: AttackAction) {
    let targetEntrant: Entrant<object> | undefined;

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
      targetEntrant.status.health.value -= getPrimaryStat(entrant.combatant);
    }
  }

  private getEntrantArray() {
    if (!this.leftTeam || !this.rightTeam) {
      return [];
    }

    return this.leftTeam.entrants.concat(this.rightTeam.entrants);
  }
}
