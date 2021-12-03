import { MovementDirection } from "../Arena";

export enum ActionType {
  Movement,
}

export interface MovementAction {
  type: ActionType.Movement;
  direction: MovementDirection;
}

export type Action = MovementAction;

const actions = {
  move: (direction: MovementDirection): MovementAction => {
    return {
      type: ActionType.Movement,
      direction,
    };
  },
};

export { actions };
