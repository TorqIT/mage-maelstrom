import Pathfinding from "pathfinding";
import { Coordinate, MovementDirection, ReadonlyCoordinate } from "../Arena";
import { ExtendedAbilityType, SpellStatus, SpellTarget } from "./Ability";
import { ReadonlyEntrantStatus } from "./entrant";

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

export interface ActionFactory {
  move: (direction: MovementDirection) => MovementAction;
  moveTo: (targetCoord: ReadonlyCoordinate) => MovementAction | undefined;
  attack: (target: MovementDirection | number) => AttackAction;
  cast: (spell: SpellStatus, target?: SpellTarget) => SpellAction;
  /** /dance */
  dance: () => DanceAction;
}

export function buildActionFactory(
  you: ReadonlyEntrantStatus,
  allies: ReadonlyEntrantStatus[],
  visibleEnemies: ReadonlyEntrantStatus[],
  arena: { width: number; height: number }
): ActionFactory {
  return {
    move: (direction: MovementDirection): MovementAction => {
      return {
        type: ActionType.Movement,
        direction,
      };
    },
    moveTo: (targetCoord: ReadonlyCoordinate): MovementAction | undefined => {
      const grid = new Pathfinding.Grid(arena.width, arena.height);

      const everyoneButYou = allies.concat(visibleEnemies);
      everyoneButYou
        .filter(
          (e) => e.coords.x !== targetCoord.x || e.coords.y !== targetCoord.y
        )
        .forEach((e) => grid.setWalkableAt(e.coords.x, e.coords.y, false));

      const finder = new Pathfinding.BreadthFirstFinder();
      const path = finder.findPath(
        you.coords.x,
        you.coords.y,
        targetCoord.x,
        targetCoord.y,
        grid
      );

      if (
        path.length > 2 ||
        (path.length === 2 &&
          !everyoneButYou.some(
            (e) => e.coords.x === targetCoord.x && e.coords.y === targetCoord.y
          ))
      ) {
        const dir = new Coordinate(you.coords).getRelativeDirectionOf(
          new Coordinate({ x: path[1][0], y: path[1][1] })
        );

        return {
          type: ActionType.Movement,
          direction: dir,
        };
      }

      return undefined;
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

    dance: (): DanceAction => ({ type: ActionType.Dance }),
  };
}
