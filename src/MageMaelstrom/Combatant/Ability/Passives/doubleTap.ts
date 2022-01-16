import { Passive } from "..";
import { mmDoubleTap } from "../../../Common/Icon";

const CHANCE = 0.1;

export class DoubleTap extends Passive {
  public constructor() {
    super({
      type: "doubletap",
      desc: {
        name: "Double Tap",
        category: "mobility",
        description:
          `${CHANCE * 100}% chance to immediately act again after an action. ` +
          `Follow up actions have the same chance to have more follow up actions.`,
        icon: mmDoubleTap,
        flavorText: "Technically a non 0 chance to end the battle immediately.",
      },
    });
  }

  public rollForDoubleTap(): boolean {
    return Math.random() < CHANCE;
  }
}
