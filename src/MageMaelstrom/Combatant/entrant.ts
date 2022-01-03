import { Coordinate, MovementDirection, ReadonlyCoordinate } from "../Arena";
import { nextId } from "../Common";
import { ActionResult, CombatantInfo, Helpers, SpellResult } from "../Logic";
import {
  AbilityStatus,
  AbilityType,
  buildPassive,
  buildSpell,
  ExtendedAbilityType,
  ExtendedSpellStatus,
  FullSpellTarget,
  isPassive,
  isSpell,
  Passive,
  Spell,
  StatusEffect,
  StatusEffectStatus,
  StatusEffectType,
} from "./Ability";
import { Combatant, CombatantDefinition } from "./combatant";
import { loggingManager } from "../Logging";
import { GameManager } from "../Logic/GameManager";
import { aggMult, aggSum } from "../Common/aggregates";
import { ActionFactory } from "./actions";
import { mmEvasion } from "../Common/Icon";

interface Meter {
  value: number;
  max: number;
  regen: number;
}

export interface ReadonlyEntrantStatus {
  id: number;
  health: Meter;
  mana: Meter;
  coords: ReadonlyCoordinate;
  ticksUntilNextTurn: number;
  vision: number;
  statusesEffects: StatusEffectType[];
}

export interface ReadonlyEntrant {
  combatant: CombatantDefinition;
  status: ReadonlyEntrantStatus;
  spells: ExtendedSpellStatus[];
  passives: AbilityStatus[];
  statusEffects: StatusEffectStatus[];
  color: string;
  flipped: boolean;
  essential: boolean;
}

export type DamageType = "attack" | "magic" | "pure";

export class Entrant {
  private combatant: Combatant;

  private color: string;
  private flipped: boolean;
  private teamId: number;

  private id: number;
  private coords: Coordinate;
  private health: Meter;
  private mana: Meter;
  private ticksUntilNextTurn: number;

  private spells: Spell[];
  private passives: Passive[];
  private statusEffects: StatusEffect[];

  private essential: boolean;

  public constructor(
    combatant: Combatant,
    team: { color: string; flip: boolean; id: number },
    coords: Coordinate,
    essential: boolean
  ) {
    this.combatant = combatant;
    this.coords = coords;

    this.color = team.color;
    this.flipped = team.flip;
    this.teamId = team.id;

    this.id = nextId();
    this.health = {
      max: combatant.getMaxHealth(),
      value: combatant.getMaxHealth(),
      regen: combatant.getHealthRegen(),
    };

    this.mana = {
      max: combatant.getMaxMana(),
      value: combatant.getMaxMana(),
      regen: combatant.getManaRegen(),
    };

    this.ticksUntilNextTurn = Math.ceil(
      Math.random() * combatant.getTurnDelay()
    );

    const abilities = this.combatant.getAbilities();

    this.statusEffects = [];
    this.spells = abilities.filter(isSpell).map((a) => buildSpell(a));
    this.passives = abilities.filter(isPassive).map((a) => buildPassive(a));

    this.essential = essential;
  }

  //~*~*~*~*~*~*
  // PRE-START SETTERS

  public addSpell(spell: Spell) {
    this.spells.push(spell);
  }

  public addPassive(passive: Passive) {
    this.passives.push(passive);
  }

  //~*~*~*~*~*~*
  // GETTERS

  public getId() {
    return this.id;
  }

  public isEssential() {
    return this.essential;
  }

  public getTeamId() {
    return this.teamId;
  }

  public getCombatant() {
    return this.combatant;
  }

  public getCombatantInfo(): CombatantInfo {
    return {
      name: this.combatant.getDef().name,
      icon: this.combatant.getDef().icon,
      color: this.color,
    };
  }

  public getCoords() {
    return this.coords;
  }

  public getMaxStatBonus() {
    return this.passives.reduce(
      (sum, current) => (sum += current.getMaxStatAdjustment()),
      0
    );
  }

  public isMyTurn() {
    return this.ticksUntilNextTurn <= 0;
  }

  public getHealth() {
    return this.health.value;
  }

  public getMana() {
    return this.mana.value;
  }

  public isDead() {
    return this.health.value <= 0;
  }

  public getVision() {
    return (
      this.combatant.getVision() +
      aggSum(this.passives, (p) => p.getVisionAdjustment()) +
      aggSum(this.statusEffects, (s) => s.getVisionAdjustment())
    );
  }

  private rollForEvasion() {
    return this.passives.some((p) => p.rollForEvasion());
  }

  //~*~*~*~*
  // CALCULATORS

  public canSee(entrant: Entrant) {
    return this.coords.isWithinRangeOf(this.getVision(), entrant.getCoords());
  }

  //~*~*~*~*
  // UPDATE

  public update(gameManager: GameManager) {
    this.ticksUntilNextTurn -=
      aggMult(this.passives, (p) => p.getTurnSpeedMultiplier()) *
      aggMult(this.statusEffects, (s) => s.getTurnSpeedMultiplier());

    this.updateMeter(this.health, this.getHealthRegen());
    this.updateMeter(this.mana);

    this.passives.forEach((p) => p.update(this, gameManager));
    this.spells.forEach((s) => s.update());
    this.statusEffects.forEach((e) => e.update(this));

    this.statusEffects = this.statusEffects.filter((e) => !e.isFinished());
  }

  private updateMeter(meter: Meter, regen?: number) {
    meter.value = Math.min(
      meter.max,
      meter.value + (regen ?? meter.regen) / 100
    );
  }

  private getHealthRegen() {
    return (
      (this.health.regen +
        aggSum(this.statusEffects, (s) => s.getHealthRegenBonus())) *
      aggMult(this.statusEffects, (s) => s.getHealthRegenMultiplier())
    );
  }

  //~*~*~*~*
  // ACTIONS

  public act(
    actions: ActionFactory,
    helpers: Helpers,
    allies: ReadonlyEntrantStatus[],
    visibleEnemies: ReadonlyEntrantStatus[]
  ) {
    this.ticksUntilNextTurn += this.rollTurnDelay();
    return this.combatant.act({
      actions,
      helpers,
      you: this.getStatus(),
      allies,
      visibleEnemies,
      spells: this.spells.map((s) => s.toReadonlySpell()),
    });
  }

  private rollTurnDelay() {
    return this.passives.some((p) => p.rollForDoubleTap())
      ? 0
      : this.combatant.getTurnDelay();
  }

  public move(direction: MovementDirection) {
    this.coords.move(direction);
  }

  public attack(target: Entrant, damageMultiplier?: number) {
    if (target.rollForEvasion()) {
      loggingManager.logSpell({
        caster: target.getCombatantInfo(),
        spellIcon: mmEvasion,
        target: this.getCombatantInfo(),
      });

      return;
    }

    const damage = this.combatant.getDamage() * (damageMultiplier ?? 1);
    const mult = this.passives.some((p) => p.rollForCrit()) ? 2 : 1;

    this.passives.forEach((p) => p.onDealDamage(this, target, "attack"));
    target.takeDamage(damage * mult, this, "attack");

    loggingManager.logAttack({
      target: target.getCombatantInfo(),
      attacker: this.getCombatantInfo(),
      damage: damage * mult,
      remainingHealth: target.getHealth(),
      isCrit: mult !== 1,
    });
  }

  public canCast(
    spell: ExtendedAbilityType,
    target: FullSpellTarget,
    gameManager: GameManager
  ): SpellResult {
    const actualSpell = this.spells.find((s) => s.getType() === spell);

    if (!actualSpell) {
      return "InvalidSpell";
    }

    return actualSpell.canCast(this, target, gameManager);
  }

  public cast(
    spell: ExtendedAbilityType,
    target: FullSpellTarget,
    gameManager: GameManager
  ) {
    const actualSpell = this.spells.find((s) => s.getType() === spell);

    if (!actualSpell) {
      return;
    }

    actualSpell.cast(this, target, gameManager);
  }

  public takeDamage(amount: number, source: Entrant, damageType: DamageType) {
    this.passives.forEach((p) => p.onTakeDamage(source, this, damageType));
    this.health.value -=
      amount *
      aggMult(this.passives, (p) => p.getDamageTakenMultiplier(damageType)) *
      aggMult(this.statusEffects, (s) =>
        s.getDamageTakenMultiplier(damageType)
      );
    this.clampMeter(this.health);
  }

  public heal(amount: number) {
    this.health.value += amount;
    this.clampMeter(this.health);
  }

  public drainMana(amount: number) {
    this.mana.value -= amount;
    this.clampMeter(this.mana);
  }

  private clampMeter(meter: Meter) {
    meter.value = Math.max(0, Math.min(meter.value, meter.max));
  }

  public applyStatusEffect(effect: StatusEffect) {
    this.statusEffects = this.statusEffects.filter(
      (e) => e.getType() !== effect.getType()
    );
    this.statusEffects.push(effect);
  }

  //~*~*~*~*~*~*
  // READONLY REACT STUFF

  public toReadonly(): ReadonlyEntrant {
    return {
      combatant: this.combatant.getDef(),
      status: this.getStatus(),
      spells: this.spells.map((s) => s.toExtendedReadonly()),
      passives: this.passives.map((p) => p.toReadonly()),
      statusEffects: this.statusEffects.map((s) => s.toReadonly()),
      color: this.color,
      flipped: this.flipped,
      essential: this.essential,
    };
  }

  public getStatus(): ReadonlyEntrantStatus {
    return {
      id: this.id,
      health: {
        ...this.health,
        regen: this.getHealthRegen(),
      },
      mana: { ...this.mana },
      ticksUntilNextTurn: this.ticksUntilNextTurn,
      coords: this.coords.toReadonly(),
      vision: this.getVision(),
      statusesEffects: this.statusEffects.map((s) => s.getType()),
    };
  }
}
