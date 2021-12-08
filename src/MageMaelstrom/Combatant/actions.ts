import { MovementDirection } from "../Arena";

export enum ActionType {
  Movement,
  Attack,
}

export interface MovementAction {
  type: ActionType.Movement;
  direction: MovementDirection;
}

export interface AttackAction {
  type: ActionType.Attack;
  target: MovementDirection | number;
}

export type Action = MovementAction | AttackAction;

const actions = {
  move: (direction: MovementDirection): MovementAction => {
    return {
      type: ActionType.Movement,
      direction,
    };
  },
  attack: (target: MovementDirection | number): AttackAction => {
    return {
      type: ActionType.Attack,
      target,
    };
  },
};

export { actions };
