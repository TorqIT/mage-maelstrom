export type MovementDirection = "left" | "right" | "up" | "down";

export interface BasicCoordinate {
  x: number;
  y: number;
}

export class ReadonlyCoordinate {
  protected x: number;
  protected y: number;

  public constructor(coord?: BasicCoordinate) {
    this.x = coord?.x ?? 0;
    this.y = coord?.y ?? 0;
  }
  public getX() {
    return this.x;
  }
  public getY() {
    return this.y;
  }

  public equals(other: ReadonlyCoordinate) {
    return this.x === other.x && this.y === other.y;
  }

  public isNextTo(other: ReadonlyCoordinate) {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y) === 1;
  }

  public isWithinRangeOf(range: number, other: ReadonlyCoordinate) {
    return (
      Math.pow(other.x - this.x, 2) + Math.pow(other.y - this.y, 2) <=
      Math.pow(range, 2)
    );
  }

  public getDistance(target: ReadonlyCoordinate) {
    return Math.sqrt(
      Math.pow(target.x - this.x, 2) + Math.pow(target.y - this.y, 2)
    );
  }

  public getClosest(targets: ReadonlyCoordinate[]) {
    const index = this.getClosestIndex(targets);
    return index ? targets[index] : undefined;
  }

  public getClosestIndex(targets: ReadonlyCoordinate[]) {
    if (targets.length === 0) {
      return undefined;
    }

    let closest = 0;
    let closestDistance = this.getSquaredDistance(targets[0]);

    for (let j = 1; j < targets.length; j++) {
      const dist = this.getSquaredDistance(targets[j]);

      if (dist < closestDistance) {
        closestDistance = dist;
        closest = j;
      }
    }

    return closest;
  }

  /** Distance calculation except without the square root. Only useful if you're
   * _really_ worried about optimization */
  public getSquaredDistance(target: ReadonlyCoordinate) {
    return Math.pow(target.x - this.x, 2) + Math.pow(target.y - this.y, 2);
  }

  public getRelativeDirectionOf(other: ReadonlyCoordinate): MovementDirection {
    const xDiff = other.x - this.x;
    const yDiff = other.y - this.y;

    if (Math.abs(xDiff) >= Math.abs(yDiff)) {
      return xDiff > 0 ? "right" : "left";
    } else {
      return yDiff > 0 ? "up" : "down";
    }
  }

  public toBasic(): BasicCoordinate {
    return {
      x: this.x,
      y: this.y,
    };
  }

  public toString() {
    return `X: ${this.x} Y: ${this.y}`;
  }
}

export class Coordinate extends ReadonlyCoordinate {
  public static getSide(coord: ReadonlyCoordinate, dir: MovementDirection) {
    const coordinate = new Coordinate(coord.toBasic());
    coordinate.move(dir);

    return coordinate;
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
        this.y++;
        break;
      case "down":
        this.y--;
        break;
    }
  }

  public teleportTo(coord: Coordinate) {
    this.x = coord.x;
    this.y = coord.y;
  }
}
