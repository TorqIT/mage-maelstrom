import { Coordinate, ReadonlyCoordinate } from "../Arena";
import { ActParameters, Combatant, CombatantDefinition } from "./combatant";

interface Meter {
  value: number;
  max: number;
}

export interface ReadonlyEntrantStatus {
  id: number;
  health: Meter;
  mana: Meter;
  coords: ReadonlyCoordinate;
  nextTurn: number;
}

export interface ReadonlyEntrant {
  combatant: CombatantDefinition;
  status: ReadonlyEntrantStatus;
}

export class Entrant {
  private static idCounter = 0;

  private combatant: Combatant;

  private id: number;
  private coords: Coordinate;
  private health: Meter;
  private mana: Meter;
  private nextTurn: number;

  public constructor(combatant: Combatant, coords: Coordinate) {
    this.combatant = combatant;
    this.coords = coords;

    this.id = Entrant.idCounter++;
    this.health = {
      max: combatant.getMaxHealth(),
      value: combatant.getMaxHealth(),
    };

    this.mana = {
      max: combatant.getMaxMana(),
      value: combatant.getMaxMana(),
    };

    this.nextTurn = combatant.getTurnDelay();
  }

  public getId() {
    return this.id;
  }

  public getCoords() {
    return this.coords;
  }

  public getNextTurn() {
    return this.nextTurn;
  }

  public getDamage() {
    return this.combatant.getDamage();
  }

  public isDead() {
    return this.health.value <= 0;
  }

  public act(...params: ActParameters) {
    return this.combatant.act(...params);
  }

  public updateNextTurn() {
    this.nextTurn += this.combatant.getTurnDelay();
  }

  public takeDamage(amount: number) {
    this.health.value -= amount;
  }

  public toReadonly(): ReadonlyEntrant {
    return {
      combatant: this.combatant.getDef(),
      status: this.getStatus(),
    };
  }

  public getStatus(): ReadonlyEntrantStatus {
    return {
      id: this.id,
      health: { ...this.health },
      mana: { ...this.mana },
      nextTurn: this.nextTurn,
      coords: this.coords.toReadonly(),
    };
  }
}
