import arrayShuffle from "array-shuffle";
import { Coordinate, MovementDirection, ReadonlyCoordinate } from "../Arena";
import {
  Action,
  ActionType,
  ActiveTeam,
  AttackAction,
  CombatantSubclass,
  Entrant,
  FullSpellTarget,
  IdentifiedTeam,
  MovementAction,
  ReadonlyActiveTeam,
  ReadonlyEntrantStatus,
  SpellAction,
  SpellTarget,
} from "../Combatant";
import {
  ActionResult,
  AttackResult,
  MoveResult,
  SpellResult,
} from "./actionResult";
import { GameSpecs } from "./gameSpecs";
import { buildHelpers } from "./helpers";
import { loggingManager } from "../Logging";

type OnChangeListener = () => void;

export class GameManager {
  private specs: GameSpecs;

  private leftTeam: ActiveTeam;
  private rightTeam: ActiveTeam;

  private currentTick = 0;

  private onChange?: OnChangeListener;

  private battleIsOver: boolean;

  public constructor(
    specs: GameSpecs,
    left: IdentifiedTeam,
    right: IdentifiedTeam
  ) {
    this.specs = specs;

    this.currentTick = 0;
    this.battleIsOver = false;

    this.leftTeam = this.buildActiveTeam(left, false);
    this.rightTeam = this.buildActiveTeam(right, true);

    this.leftTeam.entrants.forEach((e) => e.getCombatant().init());
    this.rightTeam.entrants.forEach((e) => e.getCombatant().init());

    loggingManager.clear();
  }

  //~*~*~*~*~*
  // LISTENERS

  public setOnChange(onChange: OnChangeListener) {
    this.onChange = onChange;
  }

  public clearOnChange() {
    this.onChange = undefined;
  }

  //~*~*~*~*~*
  // INITIALIZATION

  public buildCombatant(SubCombatant: CombatantSubclass) {
    return new SubCombatant(this.specs);
  }

  private buildActiveTeam(team: IdentifiedTeam, isRight: boolean): ActiveTeam {
    return {
      id: team.id,
      name: team.name,
      color: team.color,
      flip: isRight,
      entrants: team.CombatantSubclasses.map(
        (SubCombatant) =>
          new Entrant(
            new SubCombatant(this.specs),
            { color: team.color, id: team.id, flip: isRight },
            this.generateCoord()
          )
      ),
    };
  }

  private generateCoord() {
    return new Coordinate(
      Math.floor(Math.random() * this.specs.arena.width),
      Math.floor(Math.random() * this.specs.arena.height)
    );
  }

  //~*~*~*~*~*
  // GETTERS

  public getLeftTeam() {
    return this.toReadonlyActiveTeam(this.leftTeam);
  }

  public getRightTeam() {
    return this.toReadonlyActiveTeam(this.rightTeam);
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

  public getVictor() {
    if (this.leftTeam.entrants.every((e) => e.isDead())) {
      if (this.rightTeam.entrants.every((e) => e.isDead())) {
        return null;
      }

      return this.toReadonlyActiveTeam(this.rightTeam);
    }

    if (this.rightTeam.entrants.every((e) => e.isDead())) {
      return this.toReadonlyActiveTeam(this.leftTeam);
    }

    return undefined;
  }

  //~*~*~*~*~
  // TICK

  public tickUntilNextAction() {
    if (this.battleIsOver) {
      return;
    }

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
    if (this.battleIsOver) {
      return false;
    }

    this.currentTick++;

    this.getEntrantArray()
      .filter((e) => !e.isDead())
      .forEach((e) => e.update());

    const actionsToPerform = this.performTeamActions(
      this.leftTeam,
      this.rightTeam
    ).concat(this.performTeamActions(this.rightTeam, this.leftTeam));

    const results = arrayShuffle(actionsToPerform).map((a) =>
      this.tryPerformAction(a.entrant, a.action)
    );

    const potentialVictor = this.getVictor();

    if (potentialVictor !== undefined) {
      loggingManager.logVictory({
        teamId: potentialVictor !== null ? potentialVictor.id : null,
      });

      this.battleIsOver = true;

      this.onChange && this.onChange();
    } else if (triggerChangeEvents) {
      this.onChange && this.onChange();
    }

    return results.some((r) => r);
  }

  private performTeamActions(team: ActiveTeam, enemyTeam: ActiveTeam) {
    return team.entrants
      .filter((e) => e.isMyTurn() && !e.isDead())
      .map((e) => {
        let action: Action = { type: ActionType.Dance, voluntary: false };

        try {
          action = e.act(
            buildHelpers(<ActionType extends Action>(a: ActionType) =>
              this.getActionResult(e, a)
            ),
            this.getVisibleEnemyEntrants(team, enemyTeam)
          );
        } catch (e) {
          console.error(e);
        }

        return {
          entrant: e,
          action,
        };
      });
  }

  private getVisibleEnemyEntrants(
    myTeam: ActiveTeam,
    enemyTeam: ActiveTeam
  ): ReadonlyEntrantStatus[] {
    return (
      enemyTeam.entrants
        .filter(
          (enemy) =>
            !enemy.isDead() &&
            myTeam.entrants.some((friendly) =>
              enemy
                .getCoords()
                .isWithinRangeOf(
                  friendly.getCombatant().getVision(),
                  friendly.getCoords()
                )
            )
        )
        .map((e) => e.getStatus()) ?? []
    );
  }

  private tryPerformAction(entrant: Entrant, action: Action) {
    if (this.getActionResult(entrant, action) === "Success") {
      this.performAction(entrant, action);

      return true;
    }

    return false;
  }

  //~*~*~*~*~*
  //CAN PERFORM ACTION

  private getActionResult<ActionType extends Action>(
    entrant: Entrant,
    action: ActionType
  ): ActionResult<ActionType> {
    switch (action.type) {
      case ActionType.Movement:
        return this.canPerformMovementAction(
          entrant,
          action
        ) as ActionResult<ActionType>;
      case ActionType.Attack:
        return this.canPerformAttackAction(
          entrant,
          action
        ) as ActionResult<ActionType>;
      case ActionType.Spell:
        return this.canPerformSpellAction(
          entrant,
          action
        ) as ActionResult<ActionType>;
      case ActionType.Dance:
        return "Success" as ActionResult<ActionType>;
    }

    return "UnknownAction" as ActionResult<ActionType>;
  }

  private canPerformMovementAction(
    entrant: Entrant,
    action: MovementAction
  ): MoveResult {
    const result = Coordinate.getSide(entrant.getCoords(), action.direction);

    if (
      result.getX() < 0 ||
      result.getX() >= this.specs.arena.width ||
      result.getY() < 0 ||
      result.getY() >= this.specs.arena.height
    ) {
      return "OutOfArena";
    }

    if (
      this.getEntrantArray()
        .filter((e) => e.getId() !== entrant.getId() && !e.isDead())
        .some((e) => e.getCoords().equals(result))
    ) {
      return "TileOccupied";
    }

    return "Success";
  }

  private canPerformAttackAction(
    entrant: Entrant,
    action: AttackAction
  ): AttackResult {
    if (typeof action.target === "string") {
      return "Success";
    }

    const targetEntrant = this.getEntrantArray().find(
      (e) => e.getId() === action.target
    );

    if (!targetEntrant) {
      return "CombatantNotFound";
    }

    if (targetEntrant.isDead()) {
      return "TargetIsDead";
    }

    return entrant.getCoords().isNextTo(targetEntrant.getCoords())
      ? "Success"
      : "OutOfRange";
  }

  private canPerformSpellAction(
    entrant: Entrant,
    action: SpellAction
  ): SpellResult {
    const target = this.toFullSpellTarget(action.target);

    //If it's null then they tried to find a particular entrant
    // but had an invalid id.
    if (target !== null) {
      return entrant.canCast(action.spell, target, this);
    } else {
      return "CombatantNotFound";
    }
  }

  //~*~*~*~*~*
  //PERFORM ACTION

  private performAction(entrant: Entrant, action: Action) {
    switch (action.type) {
      case ActionType.Movement:
        this.move(entrant, action);
        break;
      case ActionType.Attack:
        this.attack(entrant, action);
        break;
      case ActionType.Spell:
        this.cast(entrant, action);
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
      entrant.attack(targetEntrant);
    }
  }

  private cast(entrant: Entrant, action: SpellAction) {
    const target = this.toFullSpellTarget(action.target);

    if (target !== null) {
      entrant.cast(action.spell, target, this);
    }
  }

  public addCombatant(
    SubCombatant: CombatantSubclass,
    teamId: number,
    coord: Coordinate
  ) {
    const targetTeam =
      this.leftTeam.id === teamId ? this.leftTeam : this.rightTeam;
    const targetCoord = this.findNearestOpenSpot(coord);

    const entrant = new Entrant(
      new SubCombatant(this.specs),
      targetTeam,
      targetCoord
    );
    targetTeam.entrants.push(entrant);
  }

  private findNearestOpenSpot(coord: Coordinate) {
    const movementDirs: MovementDirection[] = ["right", "up", "left", "down"];
    let targetCoord = new Coordinate(coord.getX(), coord.getY());

    let moveIndex = 0;

    for (let j = 1; j < 7; j++) {
      if (this.findIfEmptyOrMove(j, targetCoord, movementDirs[moveIndex])) {
        return targetCoord;
      }

      moveIndex = (moveIndex + 1) % 4;

      if (this.findIfEmptyOrMove(j, targetCoord, movementDirs[moveIndex])) {
        return targetCoord;
      }

      moveIndex = (moveIndex + 1) % 4;
    }

    return new Coordinate(coord.getX(), coord.getY());
  }

  private findIfEmptyOrMove(
    timesToMove: number,
    targetCoord: Coordinate,
    dir: MovementDirection
  ) {
    for (let k = 0; k < timesToMove; k++) {
      if (this.isEmpty(targetCoord)) {
        return true;
      }

      targetCoord.move(dir);
    }

    return false;
  }

  private isEmpty(coord: Coordinate) {
    if (
      coord.getX() < 0 ||
      coord.getX() >= this.specs.arena.width ||
      coord.getY() < 0 ||
      coord.getY() >= this.specs.arena.height
    ) {
      return false;
    }

    return !this.getEntrantArray().some((e) => e.getCoords().equals(coord));
  }

  //~*~*~*~*~*~*
  //OTHER STUFF

  private toFullSpellTarget(target: SpellTarget): FullSpellTarget | null {
    if (typeof target === "number") {
      return this.getEntrantArray().find((e) => e.getId() === target) ?? null;
    }

    return target;
  }

  private getEntrantArray() {
    return this.leftTeam.entrants.concat(this.rightTeam.entrants);
  }
}
