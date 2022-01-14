import { Passive, Spell, StatusEffectType } from "..";
import { Combatant } from "../..";
import { mmSentry } from "../../../Common/Icon";
import { loggingManager } from "../../../Logging";
import { GameManager } from "../../../Logic/GameManager";
import { Action } from "../../actions";
import { CombatantDefinition, ActParams } from "../../combatant";
import { DamageType, Entrant } from "../../entrant";
import { AbilityType } from "../ability";
import { Temporality } from "../Statuses/temporality";

const DURATION = 2000;

export class Sentry extends Spell {
  public constructor() {
    super({
      type: "sentry",
      cooldown: 2000,
      manaCost: 30,
      targetTypes: "nothing",
      desc: {
        name: "Build Sentry",
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
      caster.getCoords()
    );
    sentry.addPassive(new SentryPassive());
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
    return 2 / 3;
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

  public override getDamageTakenMultiplier(damageType: DamageType): number {
    return damageType === "magic" ? 0.6 : 1;
  }
}

class SentryGun extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "Sentry Gun",
      abilities: [],
      strength: 9,
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
  public onTakeDamage(
    enemyId: number,
    damage: number,
    type: DamageType,
    ability?: AbilityType
  ): void {}
  public onNegativeStatusApplied(
    enemyId: number,
    status: StatusEffectType
  ): void {}
}

//THIS ACTUALLY WORKS WOW
// type Wow = "this" | "that" | "both";

// type CoolType<Thing extends Wow> = (Thing extends ("this" | "both") ? number : never) | (Thing extends ("that" | "both") ? string : never);

// type VeryCool = CoolType<"this">
// type SomewhatCool = CoolType<"that">
// type NotCool = CoolType<"both">
