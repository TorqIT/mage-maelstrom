export type MovementDirection = "left" | "right" | "up" | "down";

export class Coordinate {
  private x: number;
  private y: number;

  public static getSide(coord: Coordinate, dir: MovementDirection) {
    const coordinate = new Coordinate(coord.x, coord.y);
    coordinate.move(dir);

    return coordinate;
  }

  public constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public getX() {
    return this.x;
  }
  public getY() {
    return this.y;
  }

  public move(dir: MovementDirection) {
    switch (dir) {
      case "left":
        this.x--;
        break;
      case "right":
        this.x++;
        break;
      case "up":
        this.y--;
        break;
      case "down":
        this.y++;
        break;
    }
  }

  public equals(other: Coordinate) {
    return this.x === other.x && this.y === other.y;
  }

  public isNextTo(other: Coordinate) {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y) === 1;
  }

  public isWithinRangeOf(range: number, other: Coordinate) {
    return (
      Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2) <=
      Math.pow(range, 2)
    );
  }

  public toReadonly(): ReadonlyCoordinate {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

export interface ReadonlyCoordinate {
  x: number;
  y: number;
}
