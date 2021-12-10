import arrayShuffle from "array-shuffle";
import { Coordinate } from "../Arena";
import {
  Action,
  ActionType,
  ActiveTeam,
  AttackAction,
  Combatant,
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

type OnChangeListener = () => void;

export class GameManager {
  private specs: GameSpecs;

  private leftTeam?: ActiveTeam;
  private rightTeam?: ActiveTeam;

  private idTracker = 0;

  private currentTick = 0;

  private onChange?: OnChangeListener;

  public constructor(specs: GameSpecs) {
    this.specs = specs;
  }

  public setOnChange(onChange: OnChangeListener) {
    this.onChange = onChange;
  }

  public clearOnChange() {
    this.onChange = undefined;
  }

  public buildCombatant(SubCombatant: CombatantSubclass) {
    return new SubCombatant(this.specs);
  }

  public startGame(left: IdentifiedTeam, right: IdentifiedTeam) {
    this.currentTick = -1;

    this.leftTeam = this.buildActiveTeam(left, false);
    this.rightTeam = this.buildActiveTeam(right, true);

    this.onChange && this.onChange();
  }

  private buildActiveTeam(team: IdentifiedTeam, isRight: boolean): ActiveTeam {
    return {
      id: team.id,
      name: team.name,
      color: team.color,
      flip: isRight,
      entrants: team.CombatantSubclasses.map(
        (SubCombatant) =>
          new Entrant(new SubCombatant(this.specs), this.generateCoord())
      ),
    };
  }

  private generateCoord() {
    return new Coordinate(
      Math.floor(Math.random() * this.specs.arena.width),
      Math.floor(Math.random() * this.specs.arena.height)
    );
  }

  public getLeftTeam() {
    return this.leftTeam ? this.toReadonlyActiveTeam(this.leftTeam) : undefined;
  }

  public getRightTeam() {
    return this.rightTeam
      ? this.toReadonlyActiveTeam(this.rightTeam)
      : undefined;
  }

  private toReadonlyActiveTeam(team: ActiveTeam): ReadonlyActiveTeam {
    return {
      ...team,
      entrants: team.entrants.map((e) => e.toReadonly()),
    };
  }

  public getCurrentTick() {
    return this.currentTick;
  }

  public tickUntilNextAction() {
    let tickCounter = 0;
    let ticked = false;

    while (tickCounter < 500 && !ticked) {
      if (this.tick(false)) {
        ticked = true;
      }

      tickCounter++;
    }

    this.onChange && this.onChange();
  }

  public tick(triggerChangeEvents: boolean) {
    if (!this.leftTeam || !this.rightTeam) {
      return;
    }

    this.currentTick++;

    const actionsToPerform = this.performTeamActions(
      this.leftTeam,
      this.rightTeam
    ).concat(this.performTeamActions(this.rightTeam, this.leftTeam));

    const results = arrayShuffle(actionsToPerform).map((a) =>
      this.tryPerformAction(a.entrant, a.action)
    );

    if (triggerChangeEvents) {
      this.onChange && this.onChange();
    }

    return results.some((r) => r);
  }

  private performTeamActions(team: ActiveTeam, enemyTeam: ActiveTeam) {
    return team.entrants
      .filter((e) => e.getNextTurn() === this.currentTick && !e.isDead())
      .map((e) => ({
        entrant: e,
        action: e.act(
          buildHelpers((a: Action) => this.getActionResult(e, a)),
          enemyTeam.entrants
            .filter((e) => !e.isDead())
            .map((e) => e.getStatus()) ?? []
        ),
      }));
  }

  private tryPerformAction(entrant: Entrant, action: Action) {
    entrant.updateNextTurn();

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
    const result = Coordinate.getSide(entrant.getCoords(), action.direction);

    if (
      result.getX() < 0 ||
      result.getX() >= this.specs.arena.width ||
      result.getY() < 0 ||
      result.getY() >= this.specs.arena.height
    ) {
      return ActionResult.OutOfArena;
    }

    if (
      this.getEntrantArray()
        .filter((e) => e.getId() !== entrant.getId() && !e.isDead())
        .some((e) => e.getCoords().equals(result))
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
      (e) => e.getId() === action.target
    );

    if (!targetEntrant) {
      return ActionResult.CombatantNotFound;
    }

    if (targetEntrant.isDead()) {
      return ActionResult.TargetIsDead;
    }

    return entrant.getCoords().isNextTo(targetEntrant.getCoords())
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
    entrant.getCoords().move(action.direction);
  }

  private attack(entrant: Entrant, action: AttackAction) {
    let targetEntrant: Entrant | undefined;

    if (typeof action.target === "string") {
      const targetCoord = Coordinate.getSide(
        entrant.getCoords(),
        action.target
      );
      targetEntrant = this.getEntrantArray().find((e) =>
        e.getCoords().equals(targetCoord)
      );
    } else {
      targetEntrant = this.getEntrantArray().find(
        (e) => e.getId() === action.target
      );
    }

    if (targetEntrant) {
      targetEntrant.takeDamage(entrant.getDamage());
    }
  }

  private getEntrantArray() {
    if (!this.leftTeam || !this.rightTeam) {
      return [];
    }

    return this.leftTeam.entrants.concat(this.rightTeam.entrants);
  }

  public getVictor() {
    if (!this.leftTeam || !this.rightTeam) {
      return undefined;
    }

    if (this.leftTeam?.entrants.every((e) => e.isDead())) {
      if (this.rightTeam?.entrants.every((e) => e.isDead())) {
        return null;
      }

      return this.toReadonlyActiveTeam(this.rightTeam);
    }

    if (this.rightTeam?.entrants.every((e) => e.isDead())) {
      return this.toReadonlyActiveTeam(this.leftTeam);
    }

    return undefined;
  }
}
