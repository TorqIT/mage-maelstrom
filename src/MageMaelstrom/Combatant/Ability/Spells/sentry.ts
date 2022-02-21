import { Passive, Spell, StatusEffectType } from "..";
import { Combatant } from "../..";
import { mmSentry } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Action } from "../../actions";
import {
  CombatantDefinition,
  ActParams,
  OnTakeDamageParams,
  OnStatusEffectAppliedParams,
} from "../../combatant";
import { DamageType, Entrant } from "../../entrant";
import { AbilityType } from "../ability";
import { Temporality } from "../Statuses/temporality";

const DURATION = 1500;

export class Sentry extends Spell {
  public constructor() {
    super({
      type: "sentry",
      cooldown: 2000,
      manaCost: 40,
      targetTypes: "nothing",
      desc: {
        name: "Build Sentry",
        category: "summons",
        description:
          "Builds an immobile sentry gun that shoots anything that gets close.  " +
          `Sentries are slightly resistant to magic but cannot be healed. Lasts ${
            DURATION / 100
          } seconds.`,
        icon: mmSentry,
      },
    });
  }

  protected castSpell(
    caster: Entrant,
    target: undefined,
    gameManager: GameManager
  ): void {
    const sentry = gameManager.addCombatant(
      SentryGun,
      caster.getTeamId(),
      caster.getCoords(),
      [new SentryPassive()]
    );
    sentry.applyStatusEffect(new Temporality(DURATION), sentry);

    loggingManager.logSpell({
      caster: caster.getCombatantInfo(),
      spellIcon: mmSentry,
    });
  }
}

class SentryPassive extends Passive {
  public constructor() {
    super({
      type: "sentryPassive",
    });
  }

  public getAttackRange(): number {
    return 3;
  }

  public getTurnSpeedMultiplier(): number {
    return 4;
  }

  public getAttackDamageMultiplier(): number {
    return 0.5;
  }

  public getVisionAdjustment(): number {
    return -0.5;
  }

  public getHealthRegenMultiplier(): number {
    return 0;
  }

  public getHealMultiplier(): number {
    return 0;
  }

  public getHealthAdjustment(): number {
    return -160;
  }

  public override getDamageTakenMultiplier(damageType: DamageType): number {
    return damageType === "magic" ? 0.6 : 1;
  }
}

class SentryGun extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "Sentry Gun",
      abilities: [],
      strength: 10,
      agility: 0,
      intelligence: 0,
      icon: mmSentry.file,
    };
  }
  public init(): void {}
  public act({ visibleEnemies, actions, helpers }: ActParams): Action {
    const closestEnemy = helpers.getClosest(visibleEnemies);
    if (closestEnemy && helpers.canPerform(actions.attack(closestEnemy.id))) {
      return actions.attack(closestEnemy.id);
    }

    return actions.dance();
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}
  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}
