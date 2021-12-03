import { Coordinate } from "../Arena";
import { Helpers } from "../Logic";
import { Action } from "./actions";

type Identified<T extends object> = T & {
  id: number;
};

export interface Combatant<Memory extends object> {
  name: string;
  icon: string;
  init: () => Memory;
  act: (helpers: Helpers, memory: Memory) => Action;
}

export type IdentifiedCombatant<Memory extends object> = Identified<
  Combatant<Memory>
>;

export interface CombatantStatus {
  id: number;
  coords: Coordinate;
  nextTurn: number;
}

export interface Entrant<Memory extends object> {
  combatant: IdentifiedCombatant<Memory>;
  team: IdentifiedTeam;
  memory: Memory;
  status: CombatantStatus;
}

export interface Team {
  name: string;
  color: string;
  combatants: Combatant<any>[];
}

export interface IdentifiedTeam extends Omit<Identified<Team>, "combatants"> {
  combatants: IdentifiedCombatant<any>[];
}

export interface ActiveTeam extends Omit<IdentifiedTeam, "combatants"> {
  flip: boolean;
  entrants: Entrant<any>[];
}
