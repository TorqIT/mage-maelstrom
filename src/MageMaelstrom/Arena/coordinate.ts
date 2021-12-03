export interface Coordinate {
  x: number;
  y: number;
}

export type MovementDirection = "left" | "right" | "up" | "down";

export function moveCoordinate(
  coords: Coordinate,
  direction: MovementDirection
) {
  const nextCoord = { ...coords };

  switch (direction) {
    case "left":
      nextCoord.x--;
      break;
    case "right":
      nextCoord.x++;
      break;
    case "up":
      nextCoord.y++;
      break;
    case "down":
      nextCoord.y--;
      break;
  }

  return nextCoord;
}

export function coordsEqual(first: Coordinate, second: Coordinate) {
  return first.x === second.x && first.y === second.y;
}
