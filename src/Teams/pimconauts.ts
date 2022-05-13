import { count } from "console";
import {
  Action,
  ActParams,
  Combatant,
  CombatantDefinition,
  Team,
} from "../MageMaelstrom";
import {
  InitParams,
  OnTakeDamageParams,
  OnStatusEffectAppliedParams,
  ActionFactory,
  SpellStatus,
} from "../MageMaelstrom/Combatant";

class PimconautsCombatant extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "Support",
      icon: "/default.svg",
      strength: 5,
      agility: 15,
      intelligence: 20,
      abilities: ["flash", "heal", "spirits", "frost"],
    };
  }

  public init(params: InitParams): void {}

  public act({
    actions,
    helpers,
    spells: [flash, heal],
    allies,
  }: ActParams): Action {
    var luke = allies[0];
    if (
      luke &&
      luke.health.value < 290 &&
      helpers.canPerform(actions.cast(heal))
    ) {
      this.shout("Alakazam!");
      return actions.cast(heal);
    } else if (helpers.canPerform(actions.cast(flash))) {
      this.shout("Let there be light!");
      return actions.cast(flash);
    } else {
      this.shout("🕺");
      return actions.dance();
    }
  }

  public onTakeDamage(params: OnTakeDamageParams): void {
    this.shout("Ouch, rude!");
  }

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {
    this.shout("You've " + params.status + "me!");
  }
}

class PimconautsCombatant2 extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "Pimconauts",
      icon: "/default.svg",
      strength: 15,
      agility: 10,
      intelligence: 15,
      abilities: ["frost", "manasteal", "bear", "fireball"],
    };
  }

  public init(params: InitParams): void {}

  public act({
    actions,
    visibleEnemies,
    helpers,
    spells: [bear, fireball],
  }: ActParams): Action {
    // if (visibleEnemies.length > 0) {
    if (helpers.canPerform(actions.cast(bear))) {
      return this.summonBear(actions, bear);
    }
    //   const closestEnemy = helpers.getClosest(visibleEnemies);
    //   if (
    //     closestEnemy != null &&
    //     closestEnemy !== undefined &&
    //     helpers.canPerform(actions.cast(fireball))
    //   ) {
    //     return actions.attackMove(closestEnemy);
    //   }
    // }

    return actions.dance();
  }

  private summonBear(actions: ActionFactory, bear: SpellStatus) {
    this.shout("Here comes the bear!!!!!");

    return actions.cast(bear); //TODO we need to add a target here as well
  }

  public onTakeDamage(params: OnTakeDamageParams): void {
    this.shout("I'm coming for you!");
  }

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

export const pimconauts: Team = {
  name: "Pimconauts",
  color: "#800080",
  author: "Luke and Logan",
  CombatantSubclasses: [PimconautsCombatant, PimconautsCombatant2],
};
