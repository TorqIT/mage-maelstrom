import { Coordinate } from "../Arena";

export interface Combatant {
  name: string;
  icon: string;
}

export interface CombatantStatus {
  id: number;
  coords: Coordinate;
}

export interface Entrant {
  combatant: Combatant;
  status: CombatantStatus;
}

export interface Team {
  name: string;
  color: string;
  combatants: Combatant[];
}

export interface ActiveTeam extends Omit<Team, "combatants"> {
  flip: boolean;
  entrants: Entrant[];
}
