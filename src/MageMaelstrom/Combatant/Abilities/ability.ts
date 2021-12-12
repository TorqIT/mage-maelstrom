import { Coordinate } from "../../Arena";
import { SpellLog } from "../../Logic";
import { Entrant } from "../entrant";

export enum AbilityType {
  Fireball,
  None,
}

export class Ability {
  protected type: AbilityType;
  protected owner: Entrant;

  public constructor(type: AbilityType, owner: Entrant) {
    this.type = type;
    this.owner = owner;
  }

  public getType() {
    return this.type;
  }
}

export interface SpellStatus {
  type: AbilityType;
  cooldownTimer: number;
  manaCost: number;
  range?: number;
}

type SpellTarget = Entrant | Coordinate | undefined;

export abstract class Spell extends Ability {
  private cooldown = 0;
  private manaCost = 0;

  private cooldownTimer = 0;

  private range?: number;

  public constructor(
    type: AbilityType,
    owner: Entrant,
    cooldown: number,
    manaCost: number,
    range?: number
  ) {
    super(type, owner);

    this.cooldown = cooldown;
    this.cooldownTimer = 0;
    this.manaCost = manaCost;
    this.range = range;
  }

  public update() {
    if (this.cooldownTimer > 0) {
      this.cooldownTimer--;
    }
  }

  public cast(target: SpellTarget) {
    if (this.cooldownTimer > 0) {
      return;
    }

    this.cooldownTimer = this.cooldown;

    return this.castSpell(target);
  }

  public getManaCost() {
    return this.manaCost;
  }

  public abstract castSpell(target: SpellTarget): SpellLog;

  public toReadonly(): SpellStatus {
    return {
      type: this.type,
      cooldownTimer: this.cooldownTimer,
      manaCost: this.manaCost,
      range: this.range,
    };
  }
}

//THIS ACTUALLY WORKS

// type ResultStruct<T extends AbilityType> = T extends AbilityType.Fireball ? string : null;

// interface CoolCombatant<Memory extends object, Spells extends [AbilityType, AbilityType]>{
//   spells: Spells;
//   init: () => Memory;
//   doStuff: (spells: [ResultStruct<Spells[0]>, ResultStruct<Spells[1]>]) => void;
// }

// function buildCombatant<Memory extends object, Spells extends [AbilityType, AbilityType]>(c: CoolCombatant<Memory, Spells>)
// :CoolCombatant<Memory, Spells> { return c}

// const tester = buildCombatant({
//   spells: [AbilityType.Fireball, AbilityType.None],
//   init: () => ({cool: "wow"}),
//   doStuff: ([fireball, none]) => {}
// })
