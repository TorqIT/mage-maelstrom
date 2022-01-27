import { Spell, StatusEffect } from "..";
import { MovementDirection, ReadonlyCoordinate } from "../../../Arena";
import { mmFear } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Action } from "../../actions";
import { ActParams } from "../../combatant";
import { Entrant } from "../../entrant";
import { FullSpellTarget } from "../spell";

const DURATION = 300;
const MOVE_SPEED_BONUS = 1.75;

export class Fear extends Spell {
  public constructor() {
    super({
      type: "fear",
      manaCost: 12,
      cooldown: 1500,
      range: 3,
      targetTypes: "entrant",
      desc: {
        name: "Fear",
        description:
          `Induce fear upon a target, causing them to move ${(
            (MOVE_SPEED_BONUS - 1) *
            100
          ).toFixed()}% faster ` +
          `while forcing them flee in terror for ${DURATION / 100} seconds.`,
        category: "debuffs",
        icon: mmFear,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: Entrant,
    gameManager: GameManager
  ): void {
    target.applyStatusEffect(new FearStatus(caster), caster);

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      target: target.getCombatantInfo(),
      spellIcon: mmFear,
    });
  }
}

class FearStatus extends StatusEffect {
  private source: Entrant;

  private lastEnemyLocation?: ReadonlyCoordinate;

  public constructor(source: Entrant) {
    super({
      type: "fear",
      duration: DURATION,
      isPositive: false,
      desc: {
        name: "Fear",
        description: `Flee in terror, move ${(
          (MOVE_SPEED_BONUS - 1) *
          100
        ).toFixed()}% faster`,
        icon: mmFear,
      },
    });

    this.source = source;
  }

  public getTurnSpeedMultiplier(): number {
    return MOVE_SPEED_BONUS;
  }

  public getOverrideAction({
    you,
    visibleEnemies,
    actions,
  }: ActParams): Action | undefined {
    const enemy = visibleEnemies.find((e) => e.id === this.source.getId());

    if (enemy) {
      this.lastEnemyLocation = enemy.coords;
      return actions.move(enemy.coords.getRelativeDirectionOf(you.coords));
    }

    if (this.lastEnemyLocation) {
      return actions.move(
        this.lastEnemyLocation.getRelativeDirectionOf(you.coords)
      );
    }

    return actions.move(
      (["up", "left", "down", "right"] as MovementDirection[])[
        Math.floor(Math.random() * 4)
      ]
    );
  }
}
