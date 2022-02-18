import { AbilityType, Passive, StatusEffectType } from "..";
import {
  Action,
  ActionFactory,
  ActParams,
  Combatant,
  CombatantDefinition,
  OnStatusEffectAppliedParams,
  OnTakeDamageParams,
} from "../..";
import { mmSpirit } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { Helpers } from "../../../Logic";
import { GameManager } from "../../../Logic/GameManager";
import { Entrant, DamageType, BasicEntrantStatus } from "../../entrant";
import { Temporality } from "../Statuses/temporality";

const CHANCE = 0.25;
const DURATION = 666;
const MANA_COST = 6;

export class VengefulSpirits extends Passive {
  public constructor() {
    super({
      type: "spirits",
      desc: {
        name: "Vengeful Spirit",
        description:
          `Has a ${
            CHANCE * 100
          }% chance to summon a spirit every time you're attacked. ` +
          `Summoning a spirit costs ${MANA_COST} mana. Spirits last for ${
            DURATION / 100
          } seconds and will only attack ` +
          `the original attacker`,
        category: "summons",
        icon: mmSpirit,
      },
    });
  }

  public onTakeDamage(
    attacker: Entrant,
    me: Entrant,
    type: DamageType,
    gameManager: GameManager
  ): void {
    if (
      type !== "attack" ||
      me.getMana() < MANA_COST ||
      Math.random() > CHANCE
    ) {
      return;
    }

    me.drainMana(MANA_COST);

    const spirit = gameManager.addCombatant(
      SpiritCombatant,
      me.getTeamId(),
      me.getCoords(),
      [new SpiritPassive()]
    );

    spirit.applyStatusEffect(new Temporality(DURATION), spirit);
    (spirit.getCombatant() as SpiritCombatant).setTarget(attacker.getId());

    loggingManager.logSpell({
      caster: me.getCombatantInfo(),
      spellIcon: mmSpirit,
    });
  }
}

class SpiritPassive extends Passive {
  public constructor() {
    super({
      type: "spiritPassive",
    });
  }

  public getTurnSpeedMultiplier(): number {
    return 4;
  }

  public getAttackDamageMultiplier(): number {
    return 1 / 4;
  }

  public getVisionAdjustment(): number {
    return -1;
  }

  public getHealthAdjustment(): number {
    return -170;
  }
}

class SpiritCombatant extends Combatant {
  private targetId: number = -1;

  public define(): CombatantDefinition {
    return {
      name: "Vengeful Spirit",
      icon: mmSpirit.file,
      strength: 2,
      agility: 0,
      intelligence: 2,
      abilities: [],
    };
  }

  public init(): void {}

  public setTarget(id: number) {
    this.targetId = id;
  }

  public act({ actions, helpers, you, visibleEnemies }: ActParams): Action {
    const targetEnemy = visibleEnemies.find((e) => e.id === this.targetId);

    if (!targetEnemy) {
      return actions.dance();
    }

    if (helpers.canPerform(actions.attack(targetEnemy.id))) {
      return actions.attack(targetEnemy.id);
    }

    const moveAction = actions.moveTo(targetEnemy.coords);

    if (moveAction) {
      return moveAction;
    }

    return actions.dance();
  }

  private tryEngageEnemy(
    actions: ActionFactory,
    helpers: Helpers,
    visibleEnemies: BasicEntrantStatus[]
  ) {}

  public onTakeDamage(params: OnTakeDamageParams): void {}
  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}
