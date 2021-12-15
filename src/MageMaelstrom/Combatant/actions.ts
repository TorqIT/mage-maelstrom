import { MovementDirection, ReadonlyCoordinate } from "../Arena";
import { AbilityType, SpellTarget } from "./Ability";

export enum ActionType {
  Movement,
  Attack,
  Spell,
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

export type Action = MovementAction | AttackAction | SpellAction;

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
  cast: (spell: AbilityType, target: SpellTarget): SpellAction => {
    return {
      type: ActionType.Spell,
      target,
      spell,
    };
  },
};

export { actions };
