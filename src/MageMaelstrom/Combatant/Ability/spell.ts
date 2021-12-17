import { SpellType } from ".";
import { MovementDirection } from "../../Arena";
import { IconDef } from "../../Common/Icon";
import { SpellLog } from "../../Logic";
import { Entrant } from "../entrant";
import {
  Ability,
  AbilityDefinition,
  AbilityStatus,
  AbilityType,
} from "./ability";

interface SpellDefinition extends Omit<AbilityDefinition, "type"> {
  type: SpellType;
  cooldown: number;
  manaCost: number;
  range?: number;
}

export interface SpellStatus {
  type: AbilityType;
  cooldownTimer: number;
  manaCost: number;
  range?: number;
}

export interface ExtendedSpellStatus extends SpellStatus, AbilityStatus {
  cooldown: number;
}

export type SpellTarget = number | MovementDirection | undefined;
export type FullSpellTarget = Exclude<SpellTarget, number> | Entrant;

export abstract class Spell extends Ability {
  private cooldown = 0;
  private manaCost = 0;

  private cooldownTimer = 0;

  private range?: number;

  public constructor(def: SpellDefinition) {
    super(def);

    this.cooldown = def.cooldown;
    this.cooldownTimer = 0;
    this.manaCost = def.manaCost;
    this.range = def.range;
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

  protected abstract castSpell(caster: Entrant, target: FullSpellTarget): void;

  public toReadonlySpell(): SpellStatus {
    return {
      type: this.def.type,
      cooldownTimer: this.cooldownTimer,
      manaCost: this.manaCost,
      range: this.range,
    };
  }

  public toExtendedReadonly(): ExtendedSpellStatus {
    return {
      ...this.toReadonly(),
      ...this.toReadonlySpell(),
      cooldown: this.cooldown,
    };
  }
}
