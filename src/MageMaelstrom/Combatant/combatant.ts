import { GameSpecs, Helpers } from "../Logic";
import { Action } from "./actions";
import { ReadonlyEntrantStatus } from "./entrant";

export interface CombatantDefinition {
  name: string;
  icon: string;
  strength: number;
  agility: number;
  intelligence: number;
}

export type ActParameters = Parameters<
  (helpers: Helpers, visibleEnemies: ReadonlyEntrantStatus[]) => {}
>;

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

  public abstract act(...params: ActParameters): Action;

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
