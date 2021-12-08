import { Coordinate } from "../Arena";
import { Helpers } from "../Logic";
import { Action } from "./actions";

type Identified<T extends object> = T & {
  id: number;
};

export interface Combatant<Memory extends object> {
  name: string;
  icon: string;
  strength: number;
  agility: number;
  intelligence: number;
  init: () => Memory;
  act: (
    helpers: Helpers,
    visibleEnemies: CombatantStatus[],
    memory: Memory
  ) => Action;
}

export type IdentifiedCombatant<Memory extends object> = Identified<
  Combatant<Memory>
>;

interface Meter {
  value: number;
  max: number;
}

export interface CombatantStatus {
  id: number;
  coords: Coordinate;
  health: Meter;
  mana: Meter;
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

export function getPrimaryStat(combatant: Combatant<object>) {
  return Math.max(
    combatant.agility,
    combatant.strength,
    combatant.intelligence
  );
}
