import { Passive } from "..";
import { Coordinate } from "../../../Arena";
import { mmTeleportitis } from "../../../Common/Icon";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant } from "../../entrant";

const MIN_DELAY = 300;
const MAX_DELAY = 600;
const MAX_RADIUS = 3.5;

export class Teleportitis extends Passive {
  private timer = 0;

  public constructor() {
    super({
      type: "teleportitis",
      desc: {
        name: "Teleportitis",
        category: "mobility",
        description:
          `Every ${MIN_DELAY / 100} to ${
            MAX_DELAY / 100
          } seconds, teleport to a random tile ` +
          `within a radius of ${MAX_RADIUS}`,
        icon: mmTeleportitis,
        flavorText: "Thanks Noita!",
      },
    });

    this.setTimer();
  }

  private setTimer() {
    this.timer =
      Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY)) + MIN_DELAY;
  }

  public override update(self: Entrant, gameManager: GameManager): void {
    this.timer--;

    if (this.timer > 0) {
      return;
    }

    this.setTimer();

    for (let j = 0; j < 100; j++) {
      const x =
        self.getCoords().getX() +
        Math.round(Math.random() * MAX_RADIUS) * (Math.random() > 0.5 ? 1 : -1);
      const y =
        self.getCoords().getY() +
        Math.round(Math.random() * MAX_RADIUS) * (Math.random() > 0.5 ? 1 : -1);

      const nextCoordinate = new Coordinate({ x, y });

      if (
        nextCoordinate.isWithinRangeOf(MAX_RADIUS, self.getCoords()) &&
        gameManager.isEmpty(nextCoordinate)
      ) {
        self.getCoords().teleportTo(nextCoordinate);
        return;
      }
    }
  }
}
