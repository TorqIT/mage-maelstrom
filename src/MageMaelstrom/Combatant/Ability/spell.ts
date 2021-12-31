import { SpellType } from ".";
import { Coordinate, MovementDirection, ReadonlyCoordinate } from "../../Arena";
import { IconDef } from "../../Common/Icon";
import { SpellLog, SpellResult } from "../../Logic";
import { GameManager } from "../../Logic/GameManager";
import { Entrant } from "../entrant";
import {
  Ability,
  AbilityDefinition,
  AbilityStatus,
  ExtendedAbilityType,
} from "./ability";

export type SpellTarget =
  | number
  | MovementDirection
  | ReadonlyCoordinate
  | undefined;
export type FullSpellTarget =
  | Exclude<SpellTarget, number | ReadonlyCoordinate>
  | Entrant
  | Coordinate;

export function isReadonlyCoordinate(
  target: SpellTarget
): target is ReadonlyCoordinate {
  if (target == null) {
    return false;
  }

  return (target as ReadonlyCoordinate).x != null;
}

export function isCoordinate(target: FullSpellTarget): target is Coordinate {
  if (target == null) {
    return false;
  }

  return (target as Coordinate).getX != null;
}

type TargetType = "nothing" | "direction" | "coordinate" | "entrant";

interface SpellDefinition extends Omit<AbilityDefinition, "type"> {
  type: SpellType;
  cooldown: number;
  manaCost: number;
  targetTypes: TargetType | TargetType[];
  range?: number;
  initialCooldown?: number;
}

export interface SpellStatus {
  type: ExtendedAbilityType;
  cooldownTimer: number;
  manaCost: number;
  range?: number;
}

export interface ExtendedSpellStatus extends SpellStatus, AbilityStatus {
  cooldown: number;
}

function getTargetResult(
  target: FullSpellTarget,
  types: TargetType[]
): "Success" | "WrongTargetType" {
  if (target == null) {
    return types.includes("nothing") ? "Success" : "WrongTargetType";
  }

  if (typeof target == "string") {
    return types.includes("direction") ? "Success" : "WrongTargetType";
  }

  if (isCoordinate(target)) {
    return types.includes("coordinate") ? "Success" : "WrongTargetType";
  }

  return types.includes("entrant") ? "Success" : "WrongTargetType";
}

export abstract class Spell extends Ability {
  private cooldown: number;
  private manaCost: number;
  private targetTypes: TargetType | TargetType[];

  private cooldownTimer = 0;

  private range?: number;

  public constructor(def: SpellDefinition) {
    super(def);

    this.cooldown = def.cooldown;
    this.cooldownTimer = def.initialCooldown ?? 0;

    this.manaCost = def.manaCost;

    this.range = def.range;

    this.targetTypes = def.targetTypes;
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

  public canCast(
    caster: Entrant,
    target: FullSpellTarget,
    gameManager: GameManager
  ): SpellResult {
    if (this.cooldownTimer > 0) {
      return "OnCooldown";
    }

    if (this.manaCost > caster.getMana()) {
      return "NotEnoughMana";
    }

    if (
      target &&
      typeof target !== "string" &&
      this.range &&
      !caster
        .getCoords()
        .isWithinRangeOf(
          this.range,
          isCoordinate(target) ? target : target.getCoords()
        )
    ) {
      return "OutOfRange";
    }

    return getTargetResult(
      target,
      typeof this.targetTypes == "string"
        ? [this.targetTypes]
        : this.targetTypes
    );
  }

  public cast(
    caster: Entrant,
    target: FullSpellTarget,
    gameManager: GameManager
  ) {
    if (this.cooldownTimer > 0 || caster.getMana() < this.manaCost) {
      return;
    }

    this.cooldownTimer = this.cooldown;
    caster.drainMana(this.manaCost);

    return this.castSpell(caster, target, gameManager);
  }

  protected abstract castSpell(
    caster: Entrant,
    target: FullSpellTarget,
    gameManager: GameManager
  ): void;

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
