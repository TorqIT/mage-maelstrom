import { MovementDirection } from "../../Arena";
import { SpellLog } from "../../Logic";
import { Entrant } from "../entrant";
import { Ability, AbilityType } from "./ability";

export interface SpellStatus {
  type: AbilityType;
  cooldownTimer: number;
  manaCost: number;
  range?: number;
}

export type SpellTarget = number | MovementDirection | undefined;
export type FullSpellTarget = Exclude<SpellTarget, number> | Entrant;

export abstract class Spell extends Ability {
  private cooldown = 0;
  private manaCost = 0;

  private cooldownTimer = 0;

  private range?: number;

  public constructor(
    type: AbilityType,
    cooldown: number,
    manaCost: number,
    range?: number
  ) {
    super(type);

    this.cooldown = cooldown;
    this.cooldownTimer = 0;
    this.manaCost = manaCost;
    this.range = range;
  }

  public getManaCost() {
    return this.manaCost;
  }

  public isOnCooldown() {
    return this.cooldownTimer > 0;
  }

  public update() {
    if (this.cooldownTimer > 0) {
      this.cooldownTimer--;
    }
  }

  public cast(caster: Entrant, target: FullSpellTarget) {
    if (this.cooldownTimer > 0 || caster.getMana() < this.manaCost) {
      return;
    }

    this.cooldownTimer = this.cooldown;
    caster.drainMana(this.manaCost);

    return this.castSpell(caster, target);
  }

  protected abstract castSpell(
    caster: Entrant,
    target: FullSpellTarget
  ): SpellLog | undefined;

  public toReadonly(): SpellStatus {
    return {
      type: this.type,
      cooldownTimer: this.cooldownTimer,
      manaCost: this.manaCost,
      range: this.range,
    };
  }
}
