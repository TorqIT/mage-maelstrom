import { Coordinate } from "../Arena";
import { Action } from "./actions";

type Identified<T extends object> = T & {
  id: number;
};

export interface Combatant {
  name: string;
  icon: string;
  act: (canPerform: (action: Action) => boolean) => Action;
}

export type IdentifiedCombatant = Identified<Combatant>;

export interface CombatantStatus {
  id: number;
  coords: Coordinate;
  nextTurn: number;
}

export interface Entrant {
  combatant: IdentifiedCombatant;
  team: IdentifiedTeam;
  status: CombatantStatus;
}

export interface Team {
  name: string;
  color: string;
  combatants: Combatant[];
}

export interface IdentifiedTeam extends Omit<Identified<Team>, "combatants"> {
  combatants: IdentifiedCombatant[];
}

export interface ActiveTeam extends Omit<IdentifiedTeam, "combatants"> {
  flip: boolean;
  entrants: Entrant[];
}
