import { Passive } from "..";
import { mmVision } from "../../../Common/Icon";

const EXTRA_VISION = 0.75;

export class Vision extends Passive {
  public getVisionAdjustment() {
    return EXTRA_VISION;
  }

  public constructor() {
    super({
      type: "vision",
      desc: {
        icon: mmVision,
        name: "Vision",
        description: `Increases vision range by ${EXTRA_VISION}`,
      },
    });
  }
}
