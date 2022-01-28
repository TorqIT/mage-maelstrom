import { Passive } from "..";
import { mmAmplitude } from "../../../Common/Icon";
import { Action } from "../../actions";
import { ActParams } from "../../combatant";

const MAGIC_DAMAGE_MULT = 1.15;
const DANCE_CHANCE = 0.1;

export class Amplitude extends Passive {
  public constructor() {
    super({
      type: "amplitude",
      desc: {
        name: "Amplitude",
        description:
          `The rhythm inside you amplifies your magic damage by ${(
            (MAGIC_DAMAGE_MULT - 1) *
            100
          ).toFixed(0)}%, ` +
          `but each turn, you have a ${(DANCE_CHANCE * 100).toFixed(
            0
          )}% chance to dance instead.`,
        category: "damage",
        icon: mmAmplitude,
      },
    });
  }

  public override getMagicDamageMultipler(): number {
    return MAGIC_DAMAGE_MULT;
  }

  public override getOverrideAction(params: ActParams): Action | undefined {
    return Math.random() < DANCE_CHANCE ? params.actions.dance() : undefined;
  }
}
