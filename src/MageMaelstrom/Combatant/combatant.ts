import { Coordinate } from "../Arena";
import { Helpers } from "../Logic";
import { Action } from "./actions";

type Identified<T extends object> = T & {
  id: number;
};

export interface CombatantDefinition {
  name: string;
  icon: string;
  strength: number;
  agility: number;
  intelligence: number;
}

export abstract class Combatant {
  private static idCounter = 0;

  private def: CombatantDefinition;
  private id: number;

  public constructor() {
    this.def = this.define();
    this.id = Combatant.idCounter++;
  }

  public abstract define(): CombatantDefinition;

  public abstract init(): void;

  public abstract act(
    helpers: Helpers,
    visibleEnemies: CombatantStatus[]
  ): Action;

  public getStrength() {
    return this.def.strength;
  }
  public getAgility() {
    return this.def.agility;
  }
  public getIntelligence() {
    return this.def.intelligence;
  }

  public getDamage() {
    return Math.max(this.def.strength, this.def.agility, this.def.intelligence);
  }

  public getDef() {
    return this.def;
  }

  public getId() {
    return this.id;
  }
}

export type CombatantSubclass = new () => Combatant;

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

export interface Entrant {
  combatant: Combatant;
  status: CombatantStatus;
}

export interface ReadonlyEntrant {
  combatant: CombatantDefinition;
  status: CombatantStatus;
}

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
