import {
  Action,
  ActParams,
  Combatant,
  CombatantDefinition,
  Team,
} from "../MageMaelstrom";
import { BasicCoordinate, Coordinate } from "../MageMaelstrom/Arena";
import {
  InitParams,
  OnTakeDamageParams,
  OnStatusEffectAppliedParams,
  ReadonlyEntrantStatus,
} from "../MageMaelstrom/Combatant";

// healer
// barrier? Evasion? Teleport? Heal RegenTarget, DispelTarget?

// Brutish Healer
class BlueSteelWarrior extends Combatant {
  public define(): CombatantDefinition {
    return {
      name: "Blue Steel",
      icon: "https://2.bp.blogspot.com/-bubRfGgMGUk/VmG1p7wJIjI/AAAAAAAAlJc/IPx2tTNuMCg/s1600/blue%2Bsteel%2Bz.jpg",
      strength: 20,
      agility: 15,
      intelligence: 5,
      abilities: ["evasion", "fireball", "heal", "teleport"],
    };
  }

  public init({ you, allies, enemies, arena, isLeft }: InitParams): void {
    this.shout("FUS ROH DAH!!!");
  }

  public act({
    actions,
    allies,
    visibleEnemies,
    you,
    spells: [heal, teleport, fireball],
  }: ActParams): Action {
    let params: Partial<ActParams> = { actions, visibleEnemies, you };

    let goldMember = allies.find((ally) => ally.id != you.id);

    if (goldMember && goldMember.health.value !== 0) {
      let healGoldMember = goldMember?.health?.value < 100;
      this.shout("heal gold member " + healGoldMember);

      if (healGoldMember) {
        if (
          distanceFrom(you.coords.toBasic(), goldMember.coords.toBasic()) >= 6
        ) {
          return actions.cast(teleport, {
            x: goldMember.coords.getX(),
            y: goldMember.coords.getY() - 1,
          });
        } else {
          return actions.cast(heal, goldMember.id);
        }
      } else {
        let attack = tryAttack(params);
        if (attack) {
          return attack;
        }
      }
    } else {
      this.shout("im here");
      let attack = tryAttack(params);
      if (attack) {
        return attack;
      }
    }

    if (actions) {
      let action = actions.moveTo({ x: 1, y: 1 });
      if (action) {
        return action;
      }
    }

    return actions.dance();
  }

  public onTakeDamage({
    enemyId,
    damage,
    type,
    ability,
  }: OnTakeDamageParams): void {
    this.shout("FUS ROH OW :'(");
  }

  public onStatusEffectApplied({
    entrantId,
    status,
    isPositive,
  }: OnStatusEffectAppliedParams): void {}
}

function tryAttack({
  actions,
  visibleEnemies,
  you,
}: Partial<ActParams>): Action | null {
  if (visibleEnemies && visibleEnemies.length > 0 && you) {
    let closestEnemy = visibleEnemies
      .sort(
        (x: ReadonlyEntrantStatus, y: ReadonlyEntrantStatus) =>
          distanceFrom(you.coords.toBasic(), x.coords.toBasic()) -
          distanceFrom(you.coords.toBasic(), y.coords.toBasic())
      )
      .pop();

    if (
      closestEnemy &&
      closestEnemy &&
      actions &&
      distanceFrom(you.coords.toBasic(), closestEnemy.coords.toBasic()) > 1
    ) {
      let action = actions.attackMove(closestEnemy);
      if (action) {
        return action;
      }
    } else {
      let action = actions?.moveTo({ x: 0, y: 0 });
    }
  }

  if (actions) {
    let action = actions.moveTo({ x: 1, y: 1 });
    if (action) {
      return action;
    }
  }

  return null;
}

function distanceFrom(coord: BasicCoordinate, target: BasicCoordinate): number {
  return coord.x - target.x + (coord.y - target.y);
}

// Sniper
class AustinPowersFajah extends Combatant {
  private recentlyPunchedBy: number = 0;
  private recentlyStatusedBy: number = 0;
  private assholes: number[] = []; //killemall

  public define(): CombatantDefinition {
    return {
      name: "Austin Powers Fajahhhh",
      icon: "https://vignette.wikia.nocookie.net/leonhartimvu/images/9/9c/Goldmember.png/revision/latest?cb=20141224083551",
      strength: 30,
      agility: 5,
      intelligence: 5,
      abilities: ["meteor", "evasion", "snipe", "vision"],
    };
  }

  public init(params: InitParams): void {}

  public act({
    visibleEnemies,
    actions,
    spells: [meteor, snipe],
    helpers,
  }: ActParams): Action {
    this.randomFunee();

    if (this.recentlyPunchedBy !== 0) {
      this.shout("STOP TOUCHING ME");
      this.recentlyPunchedBy = 0; // reset
      let whoPunchedMe = visibleEnemies.find(
        (enemy) => enemy.id === this.recentlyPunchedBy
      );
      if (whoPunchedMe !== undefined) {
        // Move away from that which punched me
        let runAway = actions.runFrom(whoPunchedMe);
        if (runAway !== undefined) {
          if (helpers.canPerform(runAway)) {
            return runAway;
          }
        }
      }
    } else if (this.recentlyStatusedBy !== 0) {
      this.recentlyStatusedBy = 0; // reset
      let whoStatusedMe = visibleEnemies.find(
        (enemy) => enemy.id === this.recentlyStatusedBy
      );
      if (whoStatusedMe !== undefined) {
        actions.cast(snipe, whoStatusedMe.coords.toBasic());
      }
    } else {
      // Actually snipe
      if (visibleEnemies.length > 0) {
        let enemyWithLowestHealth = visibleEnemies.reduce(function (
          prev,
          curr
        ) {
          return prev.health.value < curr.health.value ? prev : curr;
        });
        return actions.cast(snipe, enemyWithLowestHealth.coords.toBasic());
      } else {
        let x = Math.random() * 10;
        let y = Math.random() * 10;
        return actions.cast(snipe, { x: x, y: y });
      }
    }
    return actions.cast(meteor);
  }

  private randomFunee() {
    let random = Math.random() * 10;
    // if (random in [2, 5, 8]) {
    this.shout("I love goooooooooold");
    // }
  }

  public onTakeDamage(params: OnTakeDamageParams): void {
    if (params.type === undefined) {
      this.recentlyPunchedBy = params.enemyId;
    }
  }

  public onStatusEffectApplied(params: OnStatusEffectAppliedParams): void {
    if (!params.isPositive) {
      this.recentlyStatusedBy = params.entrantId;
    }
  }
}

export const JankyJesters: Team = {
  name: "Powers Baby Yeah",
  color: "#8a0fa3",
  author: "David & Evan",
  CombatantSubclasses: [BlueSteelWarrior, AustinPowersFajah],
};

// sniper
// Snipe spell, Vision? Ranged?, Critical

// summoner
// Bear or Sentry, Dash?, Evasion, Aura of Darkness?
