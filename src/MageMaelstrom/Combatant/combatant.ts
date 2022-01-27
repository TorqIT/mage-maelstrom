import { DamageType, ReadonlyEntrantStatus } from ".";
import { nextId } from "../Common";
import { GameSpecs, Helpers } from "../Logic";
import { SpellStatus, StatusEffectType } from "./Ability";
import { AbilityType } from "./Ability/ability";
import { Action, ActionFactory } from "./actions";
import { BasicEntrantStatus } from "./entrant";

export interface CombatantDefinition {
  name: string;
  icon: string;
  strength: number;
  agility: number;
  intelligence: number;
  abilities: AbilityType[];
}

export interface ActParams {
  actions: ActionFactory;
  helpers: Helpers;
  you: ReadonlyEntrantStatus;
  allies: ReadonlyEntrantStatus[];
  visibleEnemies: ReadonlyEntrantStatus[];
  spells: SpellStatus[];
  tick: number;
}

export abstract class Combatant {
  private def: CombatantDefinition;
  private gameSpecs: GameSpecs;
  private id: number;

  public constructor(specs: GameSpecs) {
    this.def = this.define();
    this.gameSpecs = specs;
    this.id = nextId();
  }

  //~*~*~*~*
  //CONTROLS

  public abstract define(): CombatantDefinition;

  public abstract init(): void;

  public abstract act(params: ActParams): Action;

  public abstract onTakeDamage(
    enemyId: number,
    damage: number,
    type: DamageType,
    ability?: AbilityType
  ): void;
  public abstract onNegativeStatusApplied(
    enemyId: number,
    status: StatusEffectType
  ): void;

  //~*~*~*~*
  //ATTRIBUTES

  public getStrength() {
    return this.def.strength;
  }
  public getAgility() {
    return this.def.agility;
  }
  public getIntelligence() {
    return this.def.intelligence;
  }

  public getAbilities() {
    return this.def.abilities;
  }

  //~*~*~*~*
  //STATS

  public getDamage() {
    return (
      Math.max(this.def.strength, this.def.agility, this.def.intelligence) +
      this.gameSpecs.stats.baseDamage
    );
  }

  public getMaxHealth() {
    return (
      this.def.strength * this.gameSpecs.stats.healthPerStrength +
      this.gameSpecs.stats.baseHealth
    );
  }

  public getHealthRegen() {
    return (
      this.def.strength * this.gameSpecs.stats.healthRegenPerStrength +
      this.gameSpecs.stats.baseHealthRegen
    );
  }

  public getMaxMana() {
    return (
      this.def.intelligence * this.gameSpecs.stats.manaPerInt +
      this.gameSpecs.stats.baseMana
    );
  }

  public getManaRegen() {
    return (
      this.def.intelligence * this.gameSpecs.stats.manaRegenPerInt +
      this.gameSpecs.stats.baseManaRegen
    );
  }

  public getTurnDelay() {
    return Math.ceil(
      this.gameSpecs.stats.baseAttackPeriod /
        (1 + this.gameSpecs.stats.agilityBonus * this.def.agility)
    );
  }

  public getVision() {
    return this.gameSpecs.stats.vision;
  }

  //~*~*~*~*
  //TECHNICAL

  public getGameSpecs() {
    return this.gameSpecs;
  }

  public getDef() {
    return this.def;
  }

  public getId() {
    return this.id;
  }
}

export type CombatantSubclass = new (specs: GameSpecs) => Combatant;
