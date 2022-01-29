import { DamageType, ReadonlyEntrantStatus } from ".";
import { nextId } from "../Common";
import { GameSpecs, Helpers } from "../Logic";
import { SpellStatus, StatusEffectType } from "./Ability";
import { AbilityType } from "./Ability/ability";
import { Action, ActionFactory } from "./actions";
import { BasicEntrantStatus } from "./entrant";

export interface CombatantDefinition {
  /** Your name, displayed on your character's HUD */
  name: string;
  /** A link to your icon image, displayed on your character's HUD and the arena. */
  icon: string;
  /** Your strength. The more of it you have, the higher your health and health regeneration */
  strength: number;
  /** Your agility. The more of it you have, the smaller the delay between your actions */
  agility: number;
  /** Your intelligence. The more of it you have, the higher your mana and mana regeneration */
  intelligence: number;
  /** A list of your spells and passives */
  abilities: AbilityType[];
}

export interface InitParams {
  /** A object containing all of your stats, ie, you're ID, you're health and mana,
   * your location and so on.
   */
  you: ReadonlyEntrantStatus;
  /** An array of all of your allies' info and stats */
  allies: ReadonlyEntrantStatus[];
  /** An array containing all the info on your enemies, _except_ for
   * their starting coordinates.
   */
  enemies: Omit<ReadonlyEntrantStatus, "coords">[];
  /** The width and height of the arena measured in tiles */
  arena: { width: number; height: number };
  /** A flag for which side of the arena you're starting on; **true** if left,
   * **false** if right
   */
  isLeft: boolean;
}

export interface ActParams {
  /** A collection of factory methods used to create actions. It's highly
   * recommended that you use this for all of your action generation.
   */
  actions: ActionFactory;
  /** A colleciton of helper methods scoped to your combatant. Also highly recommend */
  helpers: Helpers;
  /** A object containing all of your stats, ie, you're ID, you're health and mana,
   * your location and so on.
   */
  you: ReadonlyEntrantStatus;
  /** An array of all of your _living_ allies' info and stats */
  allies: ReadonlyEntrantStatus[];
  /** An array of all of the _living_ enemies _who are visible_. Enemies that
   * are outside of vision range aren't included in this list.
   */
  visibleEnemies: ReadonlyEntrantStatus[];
  /** An array of all of your spells and their current status. Does **not** include any
   * of your passives and is in the same order as defined on your combatant.
   */
  spells: SpellStatus[];
  /** The current game tick, where each tick equals 0.01 seconds */
  tick: number;
}

export interface OnTakeDamageParams {
  /** The ID of the enemy who dealt damage to you */
  enemyId: number;
  /** The amount of damage they dealt. Note that this number may be very small
   * as individual damage ticks from status effects are counted each tiem
   */
  damage: number;
  /** The type of damage dealt to you, (attack, magic or pure) */
  type: DamageType;
  /** The ability this damage came from. If this is undefined,
   *  the enemy directly attacked you */
  ability?: AbilityType;
}

export interface OnStatusEffectAppliedParams {
  /** The id of the enemy or ally who applied the status effect */
  entrantId: number;
  /** The type of status applied */
  status: StatusEffectType;
  /** Whether or not this status is actually benefiting you or
   * hurting you
   */
  isPositive: boolean;
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

  public abstract onTakeDamage(params: OnTakeDamageParams): void;
  public abstract onStatusEffectApplied(
    params: OnStatusEffectAppliedParams
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
