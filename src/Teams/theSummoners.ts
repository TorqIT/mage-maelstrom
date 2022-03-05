import {
  Action,
  ActParams,
  Combatant,
  CombatantDefinition,
  Team,
} from "../MageMaelstrom";
import { MovementDirection } from "../MageMaelstrom/Arena";
import {
  InitParams,
  OnTakeDamageParams,
  OnStatusEffectAppliedParams,
  ReadonlyEntrantStatus,
} from "../MageMaelstrom/Combatant";

class Summoner extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "Summoner",
      icon: "/pentagram-rose.svg",
      strength: 12,
      agility: 10,
      intelligence: 18,
      abilities: ["bear", "poison", "mind", "evasion"],
      handicap: true,
    };
  }

  public init(params: InitParams): void {}

  public act(params: ActParams): Action {
    if (this.canSummon(params)) {
      return this.summonBear(params);
    } else {
      if (this.hasBear(params)) {
        if (this.bearIsFighting(params)) {
          if (this.canPoisonBearTarget(params)) {
            return this.poisonEnemyTarget(params);
          } else {
            return this.comeInSwingin(params) ?? params.actions.dance();
          }
        } else {
          if (this.isFarFromBear(params)) {
            return this.followBear(params) ?? params.actions.dance();
          }
        }
      } else {
        return this.comeInSwingin(params) ?? params.actions.dance();
      }
    }

    return this.wanderAround(params) ?? params.actions.dance();
  }

  private canSummon({ actions, helpers, spells: [bear] }: ActParams) {
    return helpers.canPerform(actions.cast(bear));
  }

  private summonBear({ actions, spells: [bear] }: ActParams) {
    this.shout("Aaah, there you are old friend");
    return actions.cast(bear);
  }

  private hasBear({ allies }: ActParams) {
    return allies.some((a) => !a.essential);
  }

  private isFarFromBear({ allies, helpers, you }: ActParams) {
    const closestBear = helpers.getClosest(allies.filter((a) => !a.essential))!;
    return closestBear.coords.getDistance(you.coords) > 4;
  }

  private followBear({ actions, helpers, allies }: ActParams) {
    const closestBear = helpers.getClosest(allies.filter((a) => !a.essential))!;

    this.shout("Hunt them down!");
    return actions.moveTo(closestBear);
  }

  private bearIsFighting({ helpers, allies, visibleEnemies }: ActParams) {
    const closestBear = helpers.getClosest(allies.filter((a) => !a.essential))!;
    return this.getEnemyThatBearIsFighting(closestBear, visibleEnemies) != null;
  }

  private canPoisonBearTarget({
    helpers,
    allies,
    visibleEnemies,
    actions,
    spells: [, poison],
  }: ActParams) {
    const closestBear = helpers.getClosest(allies.filter((a) => !a.essential))!;
    const enemyTarget = this.getEnemyThatBearIsFighting(
      closestBear,
      visibleEnemies
    );

    return (
      enemyTarget != null &&
      helpers.canPerform(actions.cast(poison, enemyTarget.id))
    );
  }

  private poisonEnemyTarget({
    helpers,
    allies,
    visibleEnemies,
    actions,
    spells: [, poison],
  }: ActParams) {
    const closestBear = helpers.getClosest(allies.filter((a) => !a.essential))!;
    const enemyTarget = this.getEnemyThatBearIsFighting(
      closestBear,
      visibleEnemies
    )!;

    this.shout("This is gonna hurt!");
    return actions.cast(poison, enemyTarget.id);
  }

  private getEnemyThatBearIsFighting(
    bear: ReadonlyEntrantStatus,
    visibleEnemies: ReadonlyEntrantStatus[]
  ) {
    return visibleEnemies.find((e) => e.coords.getDistance(bear.coords) < 2.5);
  }

  private wanderAround({ actions, helpers }: ActParams) {
    for (let j = 0; j < 10; j++) {
      const dir: MovementDirection = (
        ["left", "right", "up", "down"] as MovementDirection[]
      )[Math.floor(Math.random() * 4)];

      if (helpers.canPerform(actions.move(dir))) {
        this.shout("Now where might they be?");
        return actions.move(dir);
      }
    }
  }

  private comeInSwingin({
    actions,
    visibleEnemies,
    helpers,
    spells: [, poison],
  }: ActParams) {
    const closestEnemy = helpers.getClosest(visibleEnemies);

    if (!closestEnemy) {
      return actions.dance();
    }

    if (helpers.canPerform(actions.cast(poison, closestEnemy.id))) {
      this.shout("This is gonna hurt!");
      return actions.cast(poison, closestEnemy.id);
    }

    this.shout("You've got it coming for you now!");
    return actions.attackMove(closestEnemy);
  }

  public onTakeDamage(params: OnTakeDamageParams): void {}

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {}
}

export const summoners: Team = {
  name: "The Summoners",
  color: "#FA2",
  CombatantSubclasses: [Summoner, Summoner],
};
