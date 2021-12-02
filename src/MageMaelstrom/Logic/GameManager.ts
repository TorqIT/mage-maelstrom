import {
  Action,
  ActionType,
  ActiveTeam,
  Combatant,
  Entrant,
  IdentifiedCombatant,
  IdentifiedTeam,
  MovementAction,
  Team,
} from "../Combatant";

export class GameManager {
  private arenaWidth: number;
  private arenaHeight: number;

  private leftTeam?: ActiveTeam;
  private rightTeam?: ActiveTeam;

  private idTracker = 0;

  private currentTick = 0;

  public constructor(arenaWidth: number, arenaHeight: number) {
    this.arenaWidth = arenaWidth;
    this.arenaHeight = arenaHeight;
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
    combatant: IdentifiedCombatant,
    team: IdentifiedTeam
  ): Entrant {
    return {
      combatant,
      team,
      status: {
        id: this.idTracker++,
        coords: {
          x: Math.floor(Math.random() * this.arenaWidth),
          y: Math.floor(Math.random() * this.arenaHeight),
        },
        nextTurn: 0,
      },
    };
  }

  private getNextTurn(entrant: Entrant) {
    return this.currentTick + 10;
  }

  public getLeftTeam() {
    return this.leftTeam;
  }

  public getRightTeam() {
    return this.rightTeam;
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
        action: e.combatant.act(),
      }))
      .concat(
        this.rightTeam.entrants
          .filter((e) => e.status.nextTurn === this.currentTick)
          .map((e) => ({
            entrant: e,
            action: e.combatant.act(),
          }))
      );

    actionsToPerform.forEach((a) => {
      this.performAction(a.entrant, a.action);
    });

    return actionsToPerform.length > 0;
  }

  private performAction(entrant: Entrant, action: Action) {
    switch (action.type) {
      case ActionType.Movement:
        this.move(entrant, action);
        break;
    }

    entrant.status.nextTurn = this.getNextTurn(entrant);
  }

  private move(entrant: Entrant, action: MovementAction) {
    switch (action.direction) {
      case "left":
        entrant.status.coords.x--;
        break;
      case "right":
        entrant.status.coords.x++;
        break;
      case "up":
        entrant.status.coords.y++;
        break;
      case "down":
        entrant.status.coords.y--;
        break;
    }
  }

  public getCurrentTick() {
    return this.currentTick;
  }
}
