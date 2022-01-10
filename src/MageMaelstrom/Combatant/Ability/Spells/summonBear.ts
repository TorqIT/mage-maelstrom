import {
  Action,
  ActionFactory,
  ActParams,
  Combatant,
  CombatantDefinition,
} from "../..";
import { mmBear } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { Helpers } from "../../../Logic";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant, ReadonlyEntrantStatus } from "../../entrant";
import { Passive } from "../passive";
import { FullSpellTarget, Spell } from "../spell";
import { Temporality } from "../Statuses/temporality";

const DURATION = 4000;

const STRENGTH = 8;
const AGILITY = 8;
const INTELLIGENCE = 5;

export class SummonBear extends Spell {
  public constructor() {
    super({
      desc: {
        icon: mmBear,
        name: "Summon Bear",
        description:
          `Summon a ${STRENGTH}/${AGILITY}/${INTELLIGENCE} bear that lasts for ${
            DURATION / 100
          } seconds. Lumbers around slowly but moves quicker ` +
          "when an enemy is close by.",
      },
      type: "bear",
      manaCost: 45,
      cooldown: 3000,
      targetTypes: "nothing",
    });
  }

  protected castSpell(
    caster: Entrant,
    target: FullSpellTarget,
    gameManager: GameManager
  ): void {
    const bear = gameManager.addCombatant(
      BearCombatant,
      caster.getTeamId(),
      caster.getCoords()
    );

    bear.addPassive(new BearPassive());
    bear.applyStatusEffect(new Temporality(DURATION));

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      spellIcon: mmBear,
    });
  }
}

class BearPassive extends Passive {
  private frenzy = false;

  public constructor() {
    super({
      type: "bearPassive",
    });
  }

  public override update(self: Entrant, gameManager: GameManager) {
    const enemyTeam = gameManager.getEnemyTeam(self.getTeamId());
    this.frenzy = enemyTeam.entrants.some((e) => self.canSee(e));
  }

  public override getVisionAdjustment() {
    return -1;
  }

  public override getTurnSpeedMultiplier() {
    return this.frenzy ? 4 / 3 : 0.8;
  }
}

class BearCombatant extends Combatant {
  private targetX = 0;
  private targetY = 0;

  public define(): CombatantDefinition {
    return {
      name: "A Bear",
      icon: mmBear.file,
      strength: STRENGTH,
      agility: AGILITY,
      intelligence: INTELLIGENCE,
      abilities: [],
    };
  }

  public init(): void {
    this.generateTarget();
  }

  public act({ actions, helpers, you, visibleEnemies }: ActParams): Action {
    const action = this.tryEngageEnemy(actions, helpers, visibleEnemies);

    if (action) {
      return action;
    }

    const moveAction = this.tryGetMovementAction(actions, helpers);

    if (moveAction) {
      return moveAction;
    }

    return actions.dance();
  }

  private tryEngageEnemy(
    actions: ActionFactory,
    helpers: Helpers,
    visibleEnemies: ReadonlyEntrantStatus[]
  ) {
    for (const enemy of visibleEnemies) {
      if (helpers.canPerform(actions.attack(enemy.id))) {
        return actions.attack(enemy.id);
      } else if (helpers.coords.isWithinRange(enemy.coords, 3)) {
        return actions.moveTo(enemy.coords);
      }
    }
  }

  private tryGetMovementAction(actions: ActionFactory, helpers: Helpers) {
    let checks = 0;

    while (checks < 100) {
      const action = actions.moveTo({ x: this.targetX, y: this.targetY });

      if (action && helpers.canPerform(action)) {
        return action;
      } else {
        this.generateTarget();
      }

      checks++;
    }
  }

  private generateTarget() {
    this.targetX = Math.floor(Math.random() * this.getGameSpecs().arena.width);
    this.targetY = Math.floor(Math.random() * this.getGameSpecs().arena.height);
  }
}
