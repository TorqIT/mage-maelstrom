import { MovementDirection, ReadonlyCoordinate } from "../Arena";
import { AbilityType, SpellTarget } from "./Ability";

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
  spell: AbilityType;
}

export interface DanceAction {
  type: ActionType.Dance;
  voluntary: boolean;
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
      targetDir = yDiff > 0 ? "down" : "up";
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
  cast: (spell: AbilityType, target?: SpellTarget): SpellAction => {
    return {
      type: ActionType.Spell,
      target,
      spell,
    };
  },

  /** /dance */
  dance: (): DanceAction => ({ type: ActionType.Dance, voluntary: true }),
};

export { actions };
