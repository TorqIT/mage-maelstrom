import arrayShuffle from "array-shuffle";
import { Coordinate, MovementDirection } from "../Arena";
import {
  Action,
  ActionType,
  ActiveTeam,
  AttackAction,
  buildActionFactory,
  CombatantSubclass,
  Entrant,
  FullSpellTarget,
  IdentifiedTeam,
  isReadonlyCoordinate,
  MovementAction,
  ReadonlyActiveTeam,
  ReadonlyEntrantStatus,
  SpellAction,
  SpellTarget,
} from "../Combatant";
import {
  ActionResult,
  AttackResult,
  getActionResultString,
  MoveResult,
  SpellResult,
} from "./actionResult";
import { GameSpecs } from "./gameSpecs";
import { buildHelpers } from "./helpers";
import { loggingManager } from "../Logging";
import { ServerCombatant } from "./serverCombatant";
import { nextId } from "../Common";
import { mmMeteor } from "../Common/Icon";

type OnChangeListener = () => void;

export class GameManager {
  private specs: GameSpecs;

  private leftTeam: ActiveTeam;
  private rightTeam: ActiveTeam;

  private currentTick = 0;

  private onChange?: OnChangeListener;

  private battleIsOver: boolean;

  private serverEntrant: Entrant;

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

    this.serverEntrant = new Entrant(
      new ServerCombatant(specs),
      { color: "", flip: false, id: nextId() },
      new Coordinate({ x: -100, y: -100 }),
      true
    );

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
            this.generateCoord(isRight),
            true
          )
      ),
    };
  }

  private generateCoord(right: boolean) {
    return new Coordinate({
      x:
        Math.floor(Math.random() * Math.floor(this.specs.arena.width / 2 - 1)) +
        (right ? Math.ceil(this.specs.arena.width / 2 + 1) : 0),
      y: Math.floor(Math.random() * this.specs.arena.height),
    });
  }

  //~*~*~*~*~*
  // GETTERS

  public getLeftTeam() {
    return this.toReadonlyActiveTeam(this.leftTeam);
  }

  public getRightTeam() {
    return this.toReadonlyActiveTeam(this.rightTeam);
  }

  public getEnemyTeam(yourTeamId: number) {
    return this.leftTeam.id === yourTeamId ? this.rightTeam : this.leftTeam;
  }

  public getEntrantAt(coord: Coordinate) {
    return this.getEntrantArray().find((e) => e.getCoords().equals(coord));
  }

  private toReadonlyActiveTeam(team: ActiveTeam): ReadonlyActiveTeam {
    return {
      ...team,
      entrants: team.entrants
        .filter((e) => e.isEssential() || !e.isDead())
        .map((e) => e.toReadonly()),
    };
  }

  public getCurrentTick() {
    return this.currentTick;
  }

  public getVictor() {
    if (this.allEssentialsAreDead(this.leftTeam)) {
      if (this.allEssentialsAreDead(this.rightTeam)) {
        return null;
      }

      return this.toReadonlyActiveTeam(this.rightTeam);
    }

    if (this.allEssentialsAreDead(this.rightTeam)) {
      return this.toReadonlyActiveTeam(this.leftTeam);
    }

    return undefined;
  }

  private allEssentialsAreDead(team: ActiveTeam) {
    return team.entrants
      .filter((e) => e.isEssential())
      .every((e) => e.isDead());
  }

  public isFinished() {
    return this.battleIsOver;
  }

  public getEntrantsInRadius(
    coord: Coordinate,
    radius: number,
    yourTeamId?: number,
    target?: "allies" | "enemies"
  ) {
    let entrants = this.getEntrantArray();

    if (yourTeamId) {
      if (target === "allies") {
        entrants = entrants.filter((e) => e.getTeamId() === yourTeamId);
      } else if (target === "enemies") {
        entrants = entrants.filter((e) => e.getTeamId() !== yourTeamId);
      }
    }

    return entrants.filter(
      (e) => coord.isWithinRangeOf(radius, e.getCoords()) && !e.isDead()
    );
  }

  public isInVision(enemy: Entrant) {
    const allyTeam =
      enemy.getTeamId() === this.leftTeam.id ? this.leftTeam : this.rightTeam;
    return allyTeam.entrants.some((e) => e.canSee(enemy));
  }

  //~*~*~*~*~
  // TICK

  public tick(triggerChangeEvents: boolean) {
    if (this.battleIsOver) {
      return false;
    }

    this.currentTick++;

    this.getEntrantArray()
      .filter((e) => !e.isDead())
      .forEach((e) => e.update(this));

    const actionsToPerform = this.performTeamActions(
      this.leftTeam,
      this.rightTeam
    ).concat(this.performTeamActions(this.rightTeam, this.leftTeam));

    arrayShuffle(actionsToPerform).forEach((a) =>
      this.tryPerformAction(a.entrant, a.action)
    );

    if (
      this.currentTick >= this.specs.suddenDeath.start &&
      this.currentTick % this.specs.suddenDeath.delay === 0
    ) {
      this.summonSuddenDeathMeteor();
    }

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
  }

  private performTeamActions(team: ActiveTeam, enemyTeam: ActiveTeam) {
    return team.entrants
      .filter((e) => e.isMyTurn() && !e.isDead())
      .map((e) => {
        let action: Action = {
          type: ActionType.Dance,
          error: "No action returned",
        };

        const you = e.getStatus();
        const allies = team.entrants
          .filter((ally) => ally.getId() !== e.getId())
          .map((ally) => ally.getStatus());
        const visibleEnemies = this.getVisibleEnemyEntrants(team, enemyTeam);

        try {
          action = e.act(
            buildActionFactory(you, allies, visibleEnemies, this.specs.arena),
            buildHelpers(
              e.getStatus(),
              <ActionType extends Action>(a: ActionType) =>
                this.getActionResult(e, a)
            ),
            allies,
            visibleEnemies,
            this.currentTick
          );
        } catch (e) {
          action = { type: ActionType.Dance, error: e as string };
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
            myTeam.entrants.some((friendly) => friendly.canSee(enemy))
        )
        .map((e) => e.getStatus()) ?? []
    );
  }

  private tryPerformAction(entrant: Entrant, action: Action) {
    const result = this.getActionResult(entrant, action);

    if (result === "Success") {
      this.performAction(entrant, action);
      if (action.type === ActionType.Dance) {
        loggingManager.logDance({
          dancer: entrant.getCombatantInfo(),
          error: action.error,
        });
      }
    } else {
      loggingManager.logDance({
        dancer: entrant.getCombatantInfo(),
        error: getActionResultString(result),
      });
    }
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
    return this.getMoveResult(entrant, action.direction);
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
    entrant.move(action.direction);
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

  //~*~*~*~*~*
  //SUDDEN DEATH

  private summonSuddenDeathMeteor() {
    const x =
      Math.round(
        Math.random() *
          (this.specs.arena.width + this.specs.suddenDeath.radius * 2)
      ) - this.specs.suddenDeath.radius;
    const y =
      Math.round(
        Math.random() *
          (this.specs.arena.height + this.specs.suddenDeath.radius * 2)
      ) - this.specs.suddenDeath.radius;

    const entrants = this.getEntrantsInRadius(
      new Coordinate({ x, y }),
      this.specs.suddenDeath.radius
    );

    entrants.forEach((e) => {
      const damage = Math.ceil(
        e.getCombatant().getMaxHealth() * this.specs.suddenDeath.percentDamage +
          this.specs.suddenDeath.flatDamage
      );
      e.takeDamage(damage, this.serverEntrant, "pure");

      loggingManager.logSpell({
        caster: this.serverEntrant.getCombatantInfo(),
        spellIcon: mmMeteor,
        target: e.getCombatantInfo(),
        damage: damage,
        remainingHealth: e.getHealth(),
      });
    });
  }

  //~*~*~*~*~*
  //ADD COMBATANT

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
      targetCoord,
      false
    );
    entrant.getCombatant().init();
    targetTeam.entrants.push(entrant);

    return entrant;
  }

  private findNearestOpenSpot(coord: Coordinate) {
    const movementDirs: MovementDirection[] = ["right", "up", "left", "down"];
    let targetCoord = new Coordinate({ x: coord.getX(), y: coord.getY() });

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

    return new Coordinate({ x: coord.getX(), y: coord.getY() });
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

  //~*~*~*~*~*~*
  // ENTRANT LOGIC

  public getMoveResult(
    entrant: Entrant,
    direction: MovementDirection
  ): MoveResult {
    const result = Coordinate.getSide(entrant.getCoords(), direction);

    if (!this.isInArena(result)) {
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

  public isInArena(coord: Coordinate) {
    return (
      coord.getX() >= 0 &&
      coord.getX() < this.specs.arena.width &&
      coord.getY() >= 0 &&
      coord.getY() < this.specs.arena.height
    );
  }

  public isEmpty(coord: Coordinate) {
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

    if (isReadonlyCoordinate(target)) {
      return new Coordinate(target);
    }

    return target;
  }

  private getEntrantArray() {
    return this.leftTeam.entrants.concat(this.rightTeam.entrants);
  }
}
