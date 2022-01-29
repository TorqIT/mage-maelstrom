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

export interface InitParams {
  you: ReadonlyEntrantStatus;
  allies: ReadonlyEntrantStatus[];
  enemies: Omit<ReadonlyEntrantStatus, "coords">[];
  arena: { width: number; height: number };
  isLeft: boolean;
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
  private id: number;

  public constructor() {
    this.def = this.define();
    this.id = nextId();
  }

  //~*~*~*~*
  //CONTROLS

  public abstract define(): CombatantDefinition;

  public abstract init(params: InitParams): void;

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

  //~*~*~*~*
  //TECHNICAL

  public getDef() {
    return this.def;
  }

  public getId() {
    return this.id;
  }
}

export type CombatantSubclass = new () => Combatant;
