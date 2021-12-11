import { Team } from ".";
import { Coordinate, ReadonlyCoordinate } from "../Arena";
import { ActParameters, Combatant, CombatantDefinition } from "./combatant";
import { ActiveTeam } from "./team";

interface Meter {
  value: number;
  max: number;
}

export interface ReadonlyEntrantStatus {
  id: number;
  health: Meter;
  mana: Meter;
  coords: ReadonlyCoordinate;
  ticksUntilNextTurn: number;
}

export interface ReadonlyEntrant {
  combatant: CombatantDefinition;
  status: ReadonlyEntrantStatus;
  color: string;
  flipped: boolean;
}

export class Entrant {
  private static idCounter = 0;

  private combatant: Combatant;

  private color: string;
  private flipped: boolean;

  private id: number;
  private coords: Coordinate;
  private health: Meter;
  private mana: Meter;
  private ticksUntilNextTurn: number;

  public constructor(
    combatant: Combatant,
    color: string,
    flipped: boolean,
    coords: Coordinate
  ) {
    this.combatant = combatant;
    this.coords = coords;

    this.color = color;
    this.flipped = flipped;

    this.id = Entrant.idCounter++;
    this.health = {
      max: combatant.getMaxHealth(),
      value: combatant.getMaxHealth(),
    };

    this.mana = {
      max: combatant.getMaxMana(),
      value: combatant.getMaxMana(),
    };

    this.ticksUntilNextTurn = Math.ceil(
      Math.random() * combatant.getTurnDelay()
    );
  }

  public getId() {
    return this.id;
  }

  public getCoords() {
    return this.coords;
  }

  public update() {
    this.ticksUntilNextTurn--;
  }

  public isMyTurn() {
    return this.ticksUntilNextTurn <= 0;
  }

  public getDamage() {
    return this.combatant.getDamage();
  }

  public isDead() {
    return this.health.value <= 0;
  }

  public act(...params: ActParameters) {
    this.ticksUntilNextTurn += this.combatant.getTurnDelay();
    return this.combatant.act(...params);
  }

  public takeDamage(amount: number) {
    this.health.value -= amount;
  }

  public toReadonly(): ReadonlyEntrant {
    return {
      combatant: this.combatant.getDef(),
      status: this.getStatus(),
      color: this.color,
      flipped: this.flipped,
    };
  }

  public getStatus(): ReadonlyEntrantStatus {
    return {
      id: this.id,
      health: { ...this.health },
      mana: { ...this.mana },
      ticksUntilNextTurn: this.ticksUntilNextTurn,
      coords: this.coords.toReadonly(),
    };
  }
}
