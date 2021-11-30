import { ActiveTeam, Combatant, Entrant, Team } from "../Combatant";

export class GameManager {
  private arenaWidth: number;
  private arenaHeight: number;

  private leftTeam?: ActiveTeam;
  private rightTeam?: ActiveTeam;

  private idTracker = 0;

  public constructor(arenaWidth: number, arenaHeight: number) {
    this.arenaWidth = arenaWidth;
    this.arenaHeight = arenaHeight;
  }

  public startGame(left: Team, right: Team) {
    this.leftTeam = this.buildActiveTeam(left, false);
    this.rightTeam = this.buildActiveTeam(right, true);
  }

  private buildActiveTeam(team: Team, isRight: boolean): ActiveTeam {
    return {
      name: team.name,
      color: team.color,
      flip: isRight,
      entrants: team.combatants.map((c) => this.toEntrant(c)),
    };
  }

  private toEntrant(combatant: Combatant): Entrant {
    return {
      combatant,
      status: {
        id: this.idTracker++,
        coords: {
          x: Math.floor(Math.random() * this.arenaWidth),
          y: Math.floor(Math.random() * this.arenaHeight),
        },
      },
    };
  }

  public getLeftTeam() {
    return this.leftTeam;
  }

  public getRightTeam() {
    return this.rightTeam;
  }
}
