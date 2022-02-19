import { AbilityType, SpellType, StatusEffectType } from "..";
import {
  Action,
  ActionFactory,
  ActParams,
  Combatant,
  CombatantDefinition,
  InitParams,
  OnStatusEffectAppliedParams,
  OnTakeDamageParams,
  ReadonlyEntrant,
  ReadonlyEntrantStatus,
} from "../..";
import { mmBear } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { Helpers } from "../../../Logic";
import { GameManager } from "../../../Logic/GameManager";
import { DamageType, Entrant, BasicEntrantStatus } from "../../entrant";
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
        category: "summons",
        description:
          `Summon a bear that lasts for ${
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
      caster.getCoords(),
      [new BearPassive()]
    );

    bear.applyStatusEffect(new Temporality(DURATION), bear);

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
    return this.frenzy ? 4 / 3 : 3 / 4;
  }

  public getHealthAdjustment(): number {
    return -80;
  }
}

class BearCombatant extends Combatant {
  private targetX = 0;
  private targetY = 0;

  private arena: { width: number; height: number };

  public constructor() {
    super();
    this.arena = { width: 0, height: 0 };
  }

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

  public init({ arena }: InitParams): void {
    this.arena = arena;
    this.generateTarget();
  }

  public act({ actions, helpers, you, visibleEnemies }: ActParams): Action {
    const action = this.tryEngageEnemy(actions, helpers, you, visibleEnemies);

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
    you: ReadonlyEntrantStatus,
    visibleEnemies: ReadonlyEntrantStatus[]
  ) {
    for (const enemy of visibleEnemies) {
      if (helpers.canPerform(actions.attack(enemy.id))) {
        return actions.attack(enemy.id);
      } else if (you.coords.isWithinRangeOf(3, enemy.coords)) {
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
    this.targetX = Math.floor(Math.random() * this.arena.width);
    this.targetY = Math.floor(Math.random() * this.arena.height);
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}
  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}
