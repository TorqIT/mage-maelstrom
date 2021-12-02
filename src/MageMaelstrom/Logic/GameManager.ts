import {
  ActiveTeam,
  Combatant,
  Entrant,
  IdentifiedCombatant,
  IdentifiedTeam,
  Team,
} from "../Combatant";
import { Action } from "../Combatant/actions";

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
    return this.currentTick + 100;
  }

  public getLeftTeam() {
    return this.leftTeam;
  }

  public getRightTeam() {
    return this.rightTeam;
  }

  public nextTick() {
    this.currentTick++;
    this.checkActions();
  }

  private checkActions() {}
}
