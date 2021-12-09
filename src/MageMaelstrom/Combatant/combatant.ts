import { Coordinate } from "../Arena";
import { GameSpecs, Helpers } from "../Logic";
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
  private gameSpecs: GameSpecs;
  private id: number;

  public constructor(specs: GameSpecs) {
    this.def = this.define();
    this.gameSpecs = specs;
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

  public getMaxHealth() {
    return this.def.strength * this.gameSpecs.stats.healthPerStrength;
  }

  public getHealthRegen() {
    return this.def.strength * this.gameSpecs.stats.healthRegenPerStrength;
  }

  public getMaxMana() {
    return this.def.intelligence * this.gameSpecs.stats.manaPerInt;
  }

  public getManaRegen() {
    return this.def.intelligence * this.gameSpecs.stats.manaRegenPerInt;
  }

  public getTurnDelay() {
    return Math.ceil(
      100 / Math.pow(this.gameSpecs.stats.agilityBonus, this.def.agility)
    );
  }

  public getDef() {
    return this.def;
  }

  public getId() {
    return this.id;
  }
}

export type CombatantSubclass = new (specs: GameSpecs) => Combatant;

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
