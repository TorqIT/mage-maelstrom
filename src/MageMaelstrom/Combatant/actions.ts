import Pathfinding from "pathfinding";
import { ReadonlyEntrantStatus } from ".";
import {
  Coordinate,
  MovementDirection,
  BasicCoordinate,
  ReadonlyCoordinate,
} from "../Arena";
import { ExtendedAbilityType, SpellStatus, SpellTarget } from "./Ability";
import { BasicEntrantStatus } from "./entrant";

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
  target: number;
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
  moveTo: (
    targetCoord: ReadonlyEntrantStatus | ReadonlyCoordinate | BasicCoordinate
  ) => MovementAction | undefined;
  attack: (target: number) => AttackAction;
  attackMove: (
    target: ReadonlyEntrantStatus
  ) => AttackAction | MovementAction | undefined;
  runFrom: (
    targetCoord: ReadonlyEntrantStatus | ReadonlyCoordinate | BasicCoordinate
  ) => MovementAction | undefined;
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
  function moveTo(
    targetCoord: ReadonlyEntrantStatus | ReadonlyCoordinate | BasicCoordinate
  ): MovementAction | undefined {
    const actualTarget = coordIsBasic(targetCoord)
      ? new ReadonlyCoordinate(targetCoord)
      : isCoord(targetCoord)
      ? targetCoord
      : targetCoord.coords;

    const grid = new Pathfinding.Grid(arena.width, arena.height);

    const everyoneButYou = allies.concat(visibleEnemies);
    everyoneButYou
      .filter(
        (e) =>
          e.coords.getX() !== actualTarget.getX() ||
          e.coords.getY() !== actualTarget.getY()
      )
      .forEach((e) =>
        grid.setWalkableAt(e.coords.getX(), e.coords.getY(), false)
      );

    const finder = new Pathfinding.DijkstraFinder();
    const path = finder.findPath(
      you.coords.getX(),
      you.coords.getY(),
      actualTarget.getX(),
      actualTarget.getY(),
      grid
    );

    if (
      path.length > 2 ||
      (path.length === 2 &&
        !everyoneButYou.some(
          (e) =>
            e.coords.getX() === actualTarget.getX() &&
            e.coords.getY() === actualTarget.getY()
        ))
    ) {
      const dir = new ReadonlyCoordinate(
        you.coords.toBasic()
      ).getRelativeDirectionOf(
        new ReadonlyCoordinate({ x: path[1][0], y: path[1][1] })
      );

      return {
        type: ActionType.Movement,
        direction: dir,
      };
    }

    return undefined;
  }

  function runFrom(you: ReadonlyCoordinate, target: ReadonlyCoordinate) {
    const xDiff = Math.abs(target.getX() - you.getX());
    const yDiff = Math.abs(target.getY() - you.getY());

    const lowerLeft = new ReadonlyCoordinate({ x: 0, y: 0 });
    const lowerRight = new ReadonlyCoordinate({ x: arena.width - 1, y: 0 });
    const upperLeft = new ReadonlyCoordinate({ x: 0, y: arena.height - 1 });
    const upperRight = new ReadonlyCoordinate({
      x: arena.width - 1,
      y: arena.height - 1,
    });

    if (you.getX() < target.getX()) {
      if (you.getY() < target.getY()) {
        if (you.equals(lowerLeft)) {
          return moveTo(xDiff > yDiff ? upperLeft : lowerRight);
        } else {
          return moveTo(lowerLeft);
        }
      } else {
        if (you.equals(upperLeft)) {
          return moveTo(xDiff > yDiff ? lowerLeft : upperRight);
        } else {
          return moveTo(upperLeft);
        }
      }
    } else {
      if (you.getY() < target.getY()) {
        if (you.equals(lowerRight)) {
          return moveTo(xDiff > yDiff ? upperRight : lowerLeft);
        } else {
          return moveTo(lowerRight);
        }
      } else {
        if (you.equals(upperRight)) {
          return moveTo(xDiff > yDiff ? lowerRight : upperLeft);
        } else {
          return moveTo(upperRight);
        }
      }
    }
  }

  return {
    move: (direction: MovementDirection): MovementAction => {
      return {
        type: ActionType.Movement,
        direction,
      };
    },

    moveTo,

    attack: (target: number): AttackAction => {
      return {
        type: ActionType.Attack,
        target,
      };
    },

    attackMove: (
      target: ReadonlyEntrantStatus
    ): AttackAction | MovementAction | undefined => {
      if (target.coords.isWithinRangeOf(you.attackRange, you.coords)) {
        return {
          type: ActionType.Attack,
          target: target.id,
        };
      }

      return moveTo(target.coords);
    },

    runFrom: (
      targetCoord: ReadonlyEntrantStatus | ReadonlyCoordinate | BasicCoordinate
    ) => {
      const actualTarget = coordIsBasic(targetCoord)
        ? new ReadonlyCoordinate(targetCoord)
        : isCoord(targetCoord)
        ? targetCoord
        : targetCoord.coords;

      return runFrom(you.coords, actualTarget);
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

function coordIsBasic(
  coord: ReadonlyEntrantStatus | ReadonlyCoordinate | BasicCoordinate
): coord is BasicCoordinate {
  return (coord as BasicCoordinate).x != null;
}

function isCoord(
  coord: ReadonlyEntrantStatus | ReadonlyCoordinate
): coord is ReadonlyCoordinate {
  return (coord as ReadonlyCoordinate).getX != null;
}
