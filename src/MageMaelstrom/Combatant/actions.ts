import { MovementDirection, ReadonlyCoordinate } from "../Arena";
import {
  AbilityType,
  ExtendedAbilityType,
  SpellStatus,
  SpellTarget,
  SpellType,
} from "./Ability";

export enum ActionType {
  Movement,
  Attack,
  Spell,
  Dance,
}

export interface MovementAction {
  type: ActionType.Movement;
  direction: MovementDirection;
}

export interface AttackAction {
  type: ActionType.Attack;
  target: MovementDirection | number;
}

export interface SpellAction {
  type: ActionType.Spell;
  target: SpellTarget;
  spell: ExtendedAbilityType;
}

export interface DanceAction {
  type: ActionType.Dance;
  error?: string;
}

export type Action = MovementAction | AttackAction | SpellAction | DanceAction;

const actions = {
  move: (direction: MovementDirection): MovementAction => {
    return {
      type: ActionType.Movement,
      direction,
    };
  },
  moveTo: (
    targetCoord: ReadonlyCoordinate,
    yourPosition: ReadonlyCoordinate
  ): MovementAction | undefined => {
    const xDiff = targetCoord.x - yourPosition.x;
    const yDiff = targetCoord.y - yourPosition.y;
    let targetDir: MovementDirection;

    if (xDiff === 0 && yDiff === 0) {
      return;
    }

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      targetDir = xDiff > 0 ? "right" : "left";
    } else {
      targetDir = yDiff > 0 ? "up" : "down";
    }

    return {
      type: ActionType.Movement,
      direction: targetDir,
    };
  },
  attack: (target: MovementDirection | number): AttackAction => {
    return {
      type: ActionType.Attack,
      target,
    };
  },
  cast: (spell: SpellStatus, target?: SpellTarget): SpellAction => {
    return {
      type: ActionType.Spell,
      target,
      spell: spell.type,
    };
  },

  /** /dance */
  dance: (): DanceAction => ({ type: ActionType.Dance }),
};

export { actions };
