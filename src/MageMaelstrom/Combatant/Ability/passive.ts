import { GameManager } from "../../Logic/GameManager";
import { DamageType, Entrant } from "../entrant";
import { Ability, AbilityDefinition, ExtendedPassiveType } from "./ability";

interface PassiveDefinition extends Omit<AbilityDefinition, "type"> {
  type: ExtendedPassiveType;
}

export abstract class Passive extends Ability {
  public constructor(def: PassiveDefinition) {
    super(def);
  }

  public update(self: Entrant, gameManager: GameManager) {}

  public getMaxStatAdjustment() {
    return 0;
  }

  public rollForCrit() {
    return false;
  }

  public rollForDoubleTap() {
    return false;
  }

  public rollForEvasion() {
    return false;
  }

  public getVisionAdjustment() {
    return 0;
  }

  public getTurnSpeedMultiplier() {
    return 1;
  }

  public getDamageTakenMultiplier(damageType: DamageType) {
    return 1;
  }

  public getManaRegenBonus() {
    return 0;
  }

  public onTakeDamage(attacker: Entrant, me: Entrant, type: DamageType) {}
  public onDealDamage(me: Entrant, target: Entrant, type: DamageType) {}
}
