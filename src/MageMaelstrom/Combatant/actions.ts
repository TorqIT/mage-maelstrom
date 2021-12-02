export enum ActionType {
  Movement,
}

export interface MovementAction {
  type: ActionType.Movement;
  direction: "left" | "right" | "up" | "down";
}

export type Action = MovementAction;

const actions = {
  move: (direction: "left" | "right" | "up" | "down"): MovementAction => {
    return {
      type: ActionType.Movement,
      direction,
    };
  },
};

export { actions };
