import { GameManager } from "../../Logic/GameManager";
import { Entrant } from "../entrant";
import { Ability } from "./ability";

export abstract class Passive extends Ability {
  public update(self: Entrant, gameManager: GameManager) {}

  public getMaxStatAdjustment() {
    return 0;
  }

  public rollForCrit() {
    return false;
  }

  public getVisionAdjustment() {
    return 0;
  }

  public getTurnSpeedMultiplier() {
    return 1;
  }
}
