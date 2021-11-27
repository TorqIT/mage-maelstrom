import { Coordinate } from "../Arena";

export interface Combatant {
  name: string;
  icon: string;
}

export interface CombatantStatus {
  coord: Coordinate;
}

export interface Entrant {
  combatant: Combatant;
  status: CombatantStatus;
}
