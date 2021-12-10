import { CombatantSubclass } from "./combatant";
import { Entrant, ReadonlyEntrant } from "./entrant";

type Identified<T extends object> = T & {
  id: number;
};

export interface Team {
  name: string;
  color: string;
  CombatantSubclasses: CombatantSubclass[];
}

export type IdentifiedTeam = Identified<Team>;

export interface ActiveTeam
  extends Omit<IdentifiedTeam, "CombatantSubclasses"> {
  flip: boolean;
  entrants: Entrant[];
}

export interface ReadonlyActiveTeam
  extends Omit<IdentifiedTeam, "CombatantSubclasses"> {
  flip: boolean;
  entrants: ReadonlyEntrant[];
}
